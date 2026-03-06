// NOTE: maxTotal includes all questions even if unanswered.
// If we later allow partial completion, consider switching to answered-only maxTotal.

import type { OptionId, ProblemAnalyzerSchema, QuestionId } from '@/lib/problem-analyzer/schema'

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

export type BucketCounts = {
  strongCount: number
  neutralCount: number
  riskCount: number
  totalResponses: number
}

export type ScreenDiagnostic = {
  screenId: string
  title: string
  perQuestion: PerQuestionScore[]
  screenTotalScore: number
  screenMaxTotalScore: number
  screenPercent: number
  screenTier: OverallTier
  strongCount: number
  neutralCount: number
  riskCount: number
  explanation?: string
}

export type FullInsightItem = InsightItem

export type GroupedAllInsights = {
  strengths: FullInsightItem[]
  needsValidation: FullInsightItem[]
  risks: FullInsightItem[]
}

export type ConfidenceLevel = 'high' | 'med' | 'low' | 'vlow'

export type ResultsViewModel = {
  tier: OverallTier
  percent: number
  strengths: InsightItem[]
  risksOrConstraints: InsightItem[]
  bucketCounts: BucketCounts
  screenDiagnostics: ScreenDiagnostic[]
  allInsights: GroupedAllInsights
  summaryMessage: string
  conf: ConfidenceLevel
  uncertain: QuestionId[]
}

const FALLBACK_TAKEAWAYS = {
  strong: ['TODO: Add strong takeaway variant A.', 'TODO: Add strong takeaway variant B.'],
  weak: ['TODO: Add weak takeaway variant A.', 'TODO: Add weak takeaway variant B.'],
} as const

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function sortByPriorityDesc<T extends { priorityRank: number }>(items: T[]) {
  // priorityRank: higher = more important (10 highest)
  return [...items].sort((a, b) => b.priorityRank - a.priorityRank)
}

function pickTopN<T>(items: T[], n: number) {
  return items.slice(0, n)
}

function sum(numbers: number[]) {
  return numbers.reduce((acc, value) => acc + value, 0)
}

function getQuestionPriorityRank(
  schema: ProblemAnalyzerSchema,
  questionId: QuestionId,
  fallback = 0
) {
  const rank = schema.questions[questionId]?.priorityRank
  return typeof rank === 'number' ? rank : fallback
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
    const maxScore =
      question.options.length > 0 ? Math.max(...question.options.map((option) => option.score)) : 0

    const optionId = answers[question.id]
    const selected = question.options.find((option) => option.id === optionId)

    if (!selected) continue

    maxTotal += maxScore

    total += selected.score

    const priorityRank = getQuestionPriorityRank(schema, question.id, 0)

    perQuestion.push({
      questionId: question.id,
      questionTitle: question.title,
      optionId: selected.id,
      optionLabel: selected.label,
      score: selected.score,
      maxScore,
      bucketLevel: selected.bucketLevel,
      priorityRank,
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

function resolveTakeaway(
  item: PerQuestionScore,
  schema: ProblemAnalyzerSchema,
  mode: 'strong' | 'weak'
) {
  const questionTakeaways = schema.questions[item.questionId]?.takeaways?.[mode]
  const variants = questionTakeaways ?? FALLBACK_TAKEAWAYS[mode]
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

export function getBucketCounts(perQuestion: PerQuestionScore[]): BucketCounts {
  const strongCount = perQuestion.filter((item) => item.bucketLevel === 1).length
  const neutralCount = perQuestion.filter(
    (item) => item.bucketLevel === 2 || item.bucketLevel === 3
  ).length
  const riskCount = perQuestion.filter((item) => item.bucketLevel === 4).length

  return {
    strongCount,
    neutralCount,
    riskCount,
    totalResponses: perQuestion.length,
  }
}

export function getScreenDiagnostics(
  scored: ScoredResult,
  schema: ProblemAnalyzerSchema
): ScreenDiagnostic[] {
  return schema.screens.map((screen) => {
    const screenQuestionIds = new Set(screen.questionIds)
    const perQuestion = scored.perQuestion.filter((item) => screenQuestionIds.has(item.questionId))
    const screenTotalScore = sum(perQuestion.map((item) => item.score))
    const screenMaxTotalScore = sum(
      screen.questionIds.map((questionId) => {
        const question = schema.questions[questionId]
        if (!question) return 0
        return question.options.length > 0
          ? Math.max(...question.options.map((option) => option.score))
          : 0
      })
    )
    const screenPercent =
      screenMaxTotalScore > 0 ? clamp01(screenTotalScore / screenMaxTotalScore) : 0
    const screenTier = classifyOverall(screenPercent)
    const counts = getBucketCounts(perQuestion)
    const explanation =
      screenTier === 'weak'
        ? 'Most answers in this category indicate missing validation evidence.'
        : screenTier === 'mixed'
          ? 'Some signals are positive, but parts of this area need stronger validation.'
          : undefined

    return {
      screenId: screen.id,
      title: screen.title,
      perQuestion,
      screenTotalScore,
      screenMaxTotalScore,
      screenPercent,
      screenTier,
      strongCount: counts.strongCount,
      neutralCount: counts.neutralCount,
      riskCount: counts.riskCount,
      explanation,
    }
  })
}

export function getAllInsightsGrouped(
  scored: ScoredResult,
  schema: ProblemAnalyzerSchema
): GroupedAllInsights {
  const allItems: FullInsightItem[] = scored.perQuestion.map((item) => {
    const questionPriorityRank = getQuestionPriorityRank(schema, item.questionId, item.priorityRank)
    const mode = item.bucketLevel === 1 ? 'strong' : 'weak'
    return {
      questionId: item.questionId,
      optionId: item.optionId,
      questionTitle: item.questionTitle,
      optionLabel: item.optionLabel,
      bucketLevel: item.bucketLevel,
      priorityRank: questionPriorityRank,
      commentary: resolveTakeaway(item, schema, mode),
    }
  })

  return {
    strengths: sortByPriorityDesc(allItems.filter((item) => item.bucketLevel === 1)),
    needsValidation: sortByPriorityDesc(
      allItems.filter((item) => item.bucketLevel === 2 || item.bucketLevel === 3)
    ),
    risks: sortByPriorityDesc(allItems.filter((item) => item.bucketLevel === 4)),
  }
}

export function buildResultsViewModel(
  scored: ScoredResult,
  schema: ProblemAnalyzerSchema,
  conf: ConfidenceLevel,
  uncertain: QuestionId[]
): ResultsViewModel {
  const bucketCounts = getBucketCounts(scored.perQuestion)
  const screenDiagnostics = getScreenDiagnostics(scored, schema)
  const allInsights = getAllInsightsGrouped(scored, schema)
  const strengths = pickTopN(pickStrengths(scored.perQuestion, schema), 3)
  const risksOrConstraints = pickTopN(pickRisksOrConstraints(scored.perQuestion, schema), 2)

  const summaryMessage =
    bucketCounts.riskCount > 0
      ? `Of your ${bucketCounts.totalResponses} responses, ${bucketCounts.riskCount} indicate potential risk factors worth investigating.`
      : bucketCounts.neutralCount > 0
        ? `Most signals are positive, but ${bucketCounts.neutralCount} responses suggest areas that may need further validation.`
        : 'All responses indicate strong positive signal.'

  return {
    tier: classifyOverall(scored.percent),
    percent: scored.percent,
    strengths,
    risksOrConstraints,
    bucketCounts,
    screenDiagnostics,
    allInsights,
    summaryMessage,
    conf,
    uncertain,
  }
}
