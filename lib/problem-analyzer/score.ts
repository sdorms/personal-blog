import type {
  Option,
  OptionId,
  ProblemAnalyzerSchema,
  QuestionId,
} from '@/lib/problem-analyzer/schema'

export type AnswersMap = Record<QuestionId, OptionId | undefined>

export type PerQuestionScore = {
  questionId: QuestionId
  questionTitle: string
  optionId: OptionId
  optionLabel: string
  score: number
  maxScore: number
  bucketLevel: 1 | 2 | 3 | 4
  priorityRank: number
}

export type ScoredResult = {
  total: number
  maxTotal: number
  percent: number
  perQuestion: PerQuestionScore[]
}

export type InsightItem = {
  questionId: QuestionId
  optionId: OptionId
  questionTitle: string
  optionLabel: string
  bucketLevel: 1 | 2 | 3 | 4
  priorityRank: number
  commentary: string
}

export type OverallTier = 'strong' | 'mixed' | 'weak'

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function getSelectedOption(
  schema: ProblemAnalyzerSchema,
  questionId: QuestionId,
  optionId: OptionId
): Option | undefined {
  return schema.questions[questionId]?.options.find((option) => option.id === optionId)
}

export function stableVariantIndex(seedString: string, n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0
  let hash = 0
  for (let i = 0; i < seedString.length; i += 1) {
    hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0
  }
  return hash % n
}

export function scoreAnswers(answers: AnswersMap, schema: ProblemAnalyzerSchema): ScoredResult {
  const perQuestion: PerQuestionScore[] = []
  let total = 0
  let maxTotal = 0

  for (const question of Object.values(schema.questions)) {
    const maxScore = Math.max(...question.options.map((option) => option.score))
    maxTotal += maxScore

    const optionId = answers[question.id]
    const selected = question.options.find((option) => option.id === optionId)

    if (!selected) continue

    total += selected.score

    perQuestion.push({
      questionId: question.id,
      questionTitle: question.title,
      optionId: selected.id,
      optionLabel: selected.label,
      score: selected.score,
      maxScore,
      bucketLevel: selected.bucketLevel,
      priorityRank: selected.priorityRank,
    })
  }

  const percent = maxTotal > 0 ? clamp01(total / maxTotal) : 0

  return { total, maxTotal, percent, perQuestion }
}

export function classifyOverall(percent: number): OverallTier {
  if (percent >= 0.75) return 'strong'
  if (percent >= 0.5) return 'mixed'
  return 'weak'
}

function sortByPriorityDesc(items: PerQuestionScore[]) {
  // priorityRank: higher = more important (10 highest)
  return [...items].sort((a, b) => b.priorityRank - a.priorityRank)
}

function pickTopN(items: PerQuestionScore[], n: number) {
  return items.slice(0, n)
}

function resolveTakeaway(
  item: PerQuestionScore,
  schema: ProblemAnalyzerSchema,
  mode: 'strong' | 'weak'
) {
  const option = getSelectedOption(schema, item.questionId, item.optionId)
  const questionTakeaways = schema.questions[item.questionId]?.takeaways?.[mode]
  const fallback =
    mode === 'strong'
      ? ['TODO: Add strong takeaway variant A.', 'TODO: Add strong takeaway variant B.']
      : ['TODO: Add weak takeaway variant A.', 'TODO: Add weak takeaway variant B.']
  const variants = questionTakeaways ?? option?.takeaways[mode] ?? fallback
  const index = stableVariantIndex(`${item.questionId}:${item.optionId}`, variants.length)
  return variants[index] ?? variants[0]
}

function toInsightItems(
  items: PerQuestionScore[],
  schema: ProblemAnalyzerSchema,
  mode: 'strong' | 'weak'
): InsightItem[] {
  return items.map((item) => ({
    questionId: item.questionId,
    optionId: item.optionId,
    questionTitle: item.questionTitle,
    optionLabel: item.optionLabel,
    bucketLevel: item.bucketLevel,
    priorityRank: item.priorityRank,
    commentary: resolveTakeaway(item, schema, mode),
  }))
}

export function pickRisksOrConstraints(
  perQuestion: PerQuestionScore[],
  schema: ProblemAnalyzerSchema
): InsightItem[] {
  // Rule 1: Primary Risks = all weakest-tier answers (bucket 4), top 2 by priority.
  const primaryRisks = pickTopN(
    sortByPriorityDesc(perQuestion.filter((item) => item.bucketLevel === 4)),
    2
  )

  if (primaryRisks.length > 0) {
    return toInsightItems(primaryRisks, schema, 'weak')
  }

  // Rule 2 fallback: Top Constraints = weakest tier among non-strong answers (buckets 2..3), top 2.
  const nonStrong = perQuestion.filter((item) => item.bucketLevel === 2 || item.bucketLevel === 3)
  if (nonStrong.length === 0) return []
  const weakestNonStrongBucket = Math.max(...nonStrong.map((item) => item.bucketLevel))
  const topConstraints = pickTopN(
    sortByPriorityDesc(nonStrong.filter((item) => item.bucketLevel === weakestNonStrongBucket)),
    2
  )
  return toInsightItems(topConstraints, schema, 'weak')
}

export function pickStrengths(
  perQuestion: PerQuestionScore[],
  schema: ProblemAnalyzerSchema
): InsightItem[] {
  // Rule 1: Primary Strengths = strongest-tier answers (bucket 1), top 2-3 (max 3).
  const primaryStrengths = pickTopN(
    sortByPriorityDesc(perQuestion.filter((item) => item.bucketLevel === 1)),
    3
  )

  if (primaryStrengths.length > 0) {
    return toInsightItems(primaryStrengths, schema, 'strong')
  }

  // Rule 2 fallback: Most Promising = best tier among non-weak answers (buckets 2..3), top 2.
  const nonWeak = perQuestion.filter((item) => item.bucketLevel === 2 || item.bucketLevel === 3)
  if (nonWeak.length === 0) return []
  const bestNonWeakBucket = Math.min(...nonWeak.map((item) => item.bucketLevel))
  const promisingSignals = pickTopN(
    sortByPriorityDesc(nonWeak.filter((item) => item.bucketLevel === bestNonWeakBucket)),
    2
  )
  return toInsightItems(promisingSignals, schema, 'strong')
}

/*
Sanity-check fixture (manual):
- If perQuestion buckets are [4(p=10), 4(p=2), 3(p=9)], pickRisksOrConstraints returns bucket-4 items in p10,p2 order.
- If perQuestion buckets are [3(p=8), 2(p=10)] and no bucket-4, pickRisksOrConstraints returns bucket-3 item first.
- If perQuestion buckets are [1(p=10), 1(p=6), 2(p=9)], pickStrengths returns both bucket-1 items before fallback logic.
*/
