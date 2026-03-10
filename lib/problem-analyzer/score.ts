// NOTE: maxTotal currently includes only answered questions.
// If we later require all questions for scoring, revisit this behavior explicitly.

import type { OptionId, ProblemAnalyzerSchema, QuestionId } from '@/lib/problem-analyzer/schema'

export type AnswersMap = Record<QuestionId, OptionId | undefined>

export type PerQuestionScore = {
  questionId: QuestionId
  questionTitle: string
  optionId: OptionId
  optionLabel: string
  baseScore: number
  score: number
  maxScore: number
  confidenceLevel?: QuestionConfidenceLevel
  confidenceMultiplier: number
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

export type QuestionConfidenceLevel = 'low' | 'med' | 'high'

export type StrategyPath =
  | 'build_mvp_test'
  | 'market_creation'
  | 'validate_opportunity'
  | 'refine_problem'
  | 'reconsider_idea'

export type ResultsViewModel = {
  tier: OverallTier
  verdictLabel: 'Strong Signal' | 'Emerging Signal' | 'Weak Signal'
  strategyPath: StrategyPath
  strategyDescription: string
  drivers: string[]
  nextFocus: string
  percent: number
  strengths: InsightItem[]
  risksOrConstraints: InsightItem[]
  bucketCounts: BucketCounts
  screenDiagnostics: ScreenDiagnostic[]
  allInsights: GroupedAllInsights
  summaryMessage: string
  confidenceByQuestion: Partial<Record<QuestionId, QuestionConfidenceLevel>>
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

function getDriverConfidenceMultiplier(level?: QuestionConfidenceLevel): number {
  if (level === 'high') return 1.0
  if (level === 'med') return 0.9
  if (level === 'low') return 0.7
  return 1.0
}

function getBucketWeight(bucketLevel: 1 | 2 | 3 | 4): number {
  if (bucketLevel === 1) return 1.2
  if (bucketLevel === 2) return 1.0
  if (bucketLevel === 3) return 1.3
  return 1.6
}

function getVerdictLabel(tier: OverallTier): ResultsViewModel['verdictLabel'] {
  if (tier === 'strong') return 'Strong Signal'
  if (tier === 'mixed') return 'Emerging Signal'
  return 'Weak Signal'
}

function getStrategyDescription(strategyPath: StrategyPath): string {
  if (strategyPath === 'build_mvp_test') {
    return 'Signals are strong enough to test demand with a lightweight product.'
  }
  if (strategyPath === 'market_creation') {
    return 'Customers are not yet acting on the problem, so the opportunity depends on changing behavior or awareness.'
  }
  if (strategyPath === 'validate_opportunity') {
    return 'The idea looks promising, but key assumptions still need stronger validation.'
  }
  if (strategyPath === 'refine_problem') {
    return 'The opportunity is still unclear; refining the problem or customer may unlock stronger signals.'
  }
  return 'Structural signals suggest the opportunity may not be strong enough to pursue as framed.'
}

function getNextFocus(strategyPath: StrategyPath): string {
  if (strategyPath === 'build_mvp_test') {
    return 'Next focus: build a lightweight MVP and validate demand through real usage.'
  }
  if (strategyPath === 'market_creation') {
    return 'Next focus: test whether customers will adopt a new workflow or mindset around this problem.'
  }
  if (strategyPath === 'validate_opportunity') {
    return 'Next focus: validate the key assumptions with real customer signals.'
  }
  if (strategyPath === 'refine_problem') {
    return 'Next focus: refine the problem definition or target customer before proceeding.'
  }
  return 'Next focus: reconsider or significantly refine the problem before investing further.'
}

function selectStrategyPath(
  tier: OverallTier,
  structuralRiskCount: number,
  behaviorBarrierCount: number
): StrategyPath {
  if (tier === 'strong' && structuralRiskCount === 0) return 'build_mvp_test'
  if (tier !== 'weak' && behaviorBarrierCount >= 1) return 'market_creation'
  if (tier === 'mixed' && structuralRiskCount <= 1) return 'validate_opportunity'
  if (tier === 'weak' && structuralRiskCount < 2) return 'refine_problem'
  if (tier === 'weak' && structuralRiskCount >= 2) return 'reconsider_idea'
  return tier === 'strong'
    ? 'build_mvp_test'
    : tier === 'mixed'
      ? 'validate_opportunity'
      : 'refine_problem'
}

type DriverCandidate = {
  driverScore: number
  questionId: QuestionId
  bucketLevel: 1 | 2 | 3 | 4
}

function resolveDriverLabel(
  schema: ProblemAnalyzerSchema,
  questionId: QuestionId,
  bucketLevel: 1 | 2 | 3 | 4
) {
  const question = schema.questions[questionId]
  const isPositive = bucketLevel === 1
  const explicit = isPositive ? question?.driverLabels?.strong : question?.driverLabels?.weak
  if (explicit) return explicit
  const fallback = question?.shortLabel ?? question?.title ?? questionId
  return isPositive ? `strong ${fallback}` : `weak ${fallback}`
}

function selectDrivers(perQuestion: PerQuestionScore[], schema: ProblemAnalyzerSchema): string[] {
  const candidates: DriverCandidate[] = perQuestion
    .filter((item) => item.bucketLevel === 1 || item.bucketLevel >= 3)
    .map((item) => {
      const question = schema.questions[item.questionId]
      let driverScore =
        item.priorityRank *
        getBucketWeight(item.bucketLevel) *
        getDriverConfidenceMultiplier(item.confidenceLevel)
      if (question?.structural) {
        driverScore *= 1.15
      }
      return {
        driverScore,
        questionId: item.questionId,
        bucketLevel: item.bucketLevel,
      }
    })
    .sort((a, b) => b.driverScore - a.driverScore)

  const positive = candidates.filter((item) => item.bucketLevel === 1)
  const negative = candidates.filter((item) => item.bucketLevel >= 3)

  const selected: DriverCandidate[] = []
  if (positive.length > 0 && negative.length > 0) {
    selected.push(positive[0], negative[0])
  }

  for (const candidate of candidates) {
    if (selected.length >= 2) break
    if (selected.some((item) => item.questionId === candidate.questionId)) continue
    selected.push(candidate)
  }

  return selected
    .slice(0, 2)
    .map((item) => resolveDriverLabel(schema, item.questionId, item.bucketLevel))
}

function getConfidenceMultiplier(level?: QuestionConfidenceLevel): number {
  if (level === 'high') return 1.0
  if (level === 'med') return 0.8
  if (level === 'low') return 0.6
  return 1.0
}

export function stableVariantIndex(seedString: string, n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0
  let hash = 0
  for (let i = 0; i < seedString.length; i += 1) {
    hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0
  }
  return hash % n
}

export function scoreAnswers(
  answers: AnswersMap,
  schema: ProblemAnalyzerSchema,
  confidenceByQuestion?: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): ScoredResult {
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

    const baseScore = selected.score
    const confidenceLevel = confidenceByQuestion?.[question.id]
    const confidenceMultiplier = getConfidenceMultiplier(confidenceLevel)
    const effectiveScore = baseScore * confidenceMultiplier

    total += effectiveScore

    const priorityRank = getQuestionPriorityRank(schema, question.id, 0)

    perQuestion.push({
      questionId: question.id,
      questionTitle: question.title,
      optionId: selected.id,
      optionLabel: selected.label,
      baseScore,
      score: effectiveScore,
      maxScore,
      confidenceLevel,
      confidenceMultiplier,
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
  confidenceByQuestion: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): ResultsViewModel {
  const tier = classifyOverall(scored.percent)
  const verdictLabel = getVerdictLabel(tier)
  const structuralRiskCount = scored.perQuestion.filter((q) => {
    const question = schema.questions[q.questionId]
    return Boolean(question?.structural) && q.bucketLevel >= 3
  }).length
  const behaviorBarrierCount = scored.perQuestion.filter(
    (q) => q.questionId === 'customerBehavior' && q.bucketLevel >= 3
  ).length
  const strategyPath = selectStrategyPath(tier, structuralRiskCount, behaviorBarrierCount)
  const strategyDescription = getStrategyDescription(strategyPath)
  const drivers = selectDrivers(scored.perQuestion, schema)
  const nextFocus = getNextFocus(strategyPath)
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
    tier,
    verdictLabel,
    strategyPath,
    strategyDescription,
    drivers,
    nextFocus,
    percent: scored.percent,
    strengths,
    risksOrConstraints,
    bucketCounts,
    screenDiagnostics,
    allInsights,
    summaryMessage,
    confidenceByQuestion,
  }
}
