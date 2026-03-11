import InsightCard from '@/components/tools/problem-analyzer/InsightCard'
import {
  buildRecommendedActions,
  type ActionCard,
} from '@/components/tools/problem-analyzer/results-panel-actions'
import ScreenDiagnosticCard from '@/components/tools/problem-analyzer/ScreenDiagnosticCard'
import { PROBLEM_ANALYZER_SCHEMA, type QuestionId } from '@/lib/problem-analyzer/schema'
import type {
  BucketCounts,
  GroupedAllInsights,
  InsightItem,
  OverallTier,
  QuestionConfidenceLevel,
  ScreenDiagnostic,
  StrategyPath,
} from '@/lib/problem-analyzer/score'

export type ResultModel = {
  problemText: string
  audienceText: string
  tier: OverallTier
  verdictLabel: 'Strong Signal' | 'Emerging Signal' | 'Weak Signal'
  interpretation: string
  strategyPath: StrategyPath
  strategyRecommendation: string
  strategyDescription: string
  drivers: string[]
  nextFocus: string
  percent: number
  isComplete: boolean
  strengths: InsightItem[]
  risksOrConstraints: InsightItem[]
  allInsights: GroupedAllInsights
  bucketCounts: BucketCounts
  screenDiagnostics: ScreenDiagnostic[]
  summaryMessage: string
  conf: 'high' | 'med' | 'low' | 'vlow'
  confidenceByQuestion: Partial<Record<QuestionId, QuestionConfidenceLevel>>
  uncertainTitles: string[]
  uncertainQuestionIds: QuestionId[]
}

function signalStrengthLabel(tier: OverallTier) {
  if (tier === 'strong') return 'High'
  if (tier === 'mixed') return 'Medium'
  return 'Weak'
}

function meterClasses(tier: OverallTier) {
  if (tier === 'strong') return 'bg-green-500 dark:bg-green-400'
  if (tier === 'mixed') return 'bg-amber-500 dark:bg-amber-400'
  return 'bg-red-500 dark:bg-red-400'
}

function getQuestion(questionId: QuestionId) {
  return PROBLEM_ANALYZER_SCHEMA.questions[questionId]
}

function getQuestionShortLabel(questionId: QuestionId, fallback: string): string {
  return getQuestion(questionId)?.shortLabel ?? fallback
}

function getQuestionDescription(questionId: QuestionId): string | undefined {
  return getQuestion(questionId)?.description
}

function strategyLabel(strategyPath: StrategyPath) {
  if (strategyPath === 'build_mvp_test') return 'Build MVP Test'
  if (strategyPath === 'market_creation') return 'Market Creation'
  if (strategyPath === 'validate_opportunity') return 'Validate Opportunity'
  if (strategyPath === 'refine_problem') return 'Refine Problem'
  return 'Reconsider Idea'
}

function confidenceLabel(conf: ResultModel['conf']) {
  if (conf === 'high') return 'High'
  if (conf === 'med') return 'Medium'
  if (conf === 'low') return 'Low'
  return 'Very low'
}

function driversSummary(drivers: string[]) {
  if (drivers.length >= 2) return `${drivers[0]} and ${drivers[1]}.`
  if (drivers.length === 1) return `${drivers[0]}.`
  return 'Signals are mixed across categories.'
}

function formatNextFocus(text: string) {
  return text.replace(/^Next focus:\s*/i, '')
}

type DrivingSignal = {
  label: string
  polarity: 'positive' | 'risk'
}

function buildDrivingSignals(result: ResultModel): DrivingSignal[] {
  const positives = result.strengths.map((item) => ({
    label: getQuestionShortLabel(item.questionId, item.questionTitle),
    polarity: 'positive' as const,
  }))
  const risks = result.risksOrConstraints.map((item) => ({
    label: getQuestionShortLabel(item.questionId, item.questionTitle),
    polarity: 'risk' as const,
  }))

  const combined: DrivingSignal[] = []
  if (positives[0]) combined.push(positives[0])
  if (risks[0]) combined.push(risks[0])

  const leftovers = [...positives.slice(1), ...risks.slice(1)]
  for (const item of leftovers) {
    if (combined.length >= 3) break
    combined.push(item)
  }

  if (combined.length > 0) return combined.slice(0, 3)

  return result.drivers.slice(0, 3).map((driver) => ({
    label: driver,
    polarity: result.tier === 'strong' ? 'positive' : 'risk',
  }))
}

export default function ResultsPanel({ result }: { result: ResultModel }) {
  const meterWidthPercent = Math.max(0, Math.min(100, Math.round(result.percent * 100)))
  const actionCards: ActionCard[] = buildRecommendedActions(result)
  const drivingSignals = buildDrivingSignals(result)
  const uncertainCount = result.uncertainQuestionIds.length

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Opportunity Assessment
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight">{result.verdictLabel}</h2>

        <div className="mt-3 max-w-[520px]">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
            <div
              className={`h-full transition-[width] ${meterClasses(result.tier)}`}
              style={{ width: `${meterWidthPercent}%` }}
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={meterWidthPercent}
              aria-label={`Signal strength ${signalStrengthLabel(result.tier)}`}
            />
          </div>
        </div>

        <p className="mt-4 text-lg text-gray-800 dark:text-gray-100">{result.interpretation}</p>

        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Strategic Recommendation
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          {result.strategyRecommendation}
        </p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
          Strategy: {strategyLabel(result.strategyPath)}. {result.strategyDescription}
        </p>

        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Signals driving this result
        </p>
        {drivingSignals.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {drivingSignals.map((signal) => (
              <li
                key={`${signal.polarity}-${signal.label}`}
                className={
                  signal.polarity === 'positive'
                    ? 'text-sm text-green-700 dark:text-green-300'
                    : 'text-sm text-red-700 dark:text-red-300'
                }
              >
                <span aria-hidden="true" className="mr-2">
                  {signal.polarity === 'positive' ? '✓' : '!'}
                </span>
                {signal.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            {driversSummary(result.drivers)}
          </p>
        )}

        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Next Focus</p>
        <p className="mt-1 text-base text-gray-800 dark:text-gray-100">
          {formatNextFocus(result.nextFocus)}
        </p>

        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Confidence</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {confidenceLabel(result.conf)}
          {uncertainCount > 0
            ? ` · ${uncertainCount} uncertain answer${uncertainCount === 1 ? '' : 's'}`
            : ''}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
              Strong Signals
            </p>
            <p className="mt-2 text-2xl font-semibold">{result.bucketCounts.strongCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
              Needs Validation
            </p>
            <p className="mt-2 text-2xl font-semibold">{result.bucketCounts.neutralCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
              Risk Signals
            </p>
            <p className="mt-2 text-2xl font-semibold">{result.bucketCounts.riskCount}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200">{result.summaryMessage}</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
          Category Diagnostics
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {result.screenDiagnostics.map((diagnostic) => (
            <ScreenDiagnosticCard key={diagnostic.screenId} diagnostic={diagnostic} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
            Key Insights
          </h3>
          <a
            href="#all-insights"
            className="text-sm font-medium text-gray-700 hover:underline dark:text-gray-200"
          >
            View all insights →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h4 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
              Key Positive Signals
            </h4>
            {result.strengths.length > 0 ? (
              <div className="mt-3 grid gap-3">
                {result.strengths.slice(0, 3).map((item) => (
                  <InsightCard
                    key={`${item.questionId}-${item.optionId}`}
                    variant="strength"
                    title={getQuestionShortLabel(item.questionId, item.questionTitle)}
                    answer={item.optionLabel}
                    commentary={item.commentary}
                    whyMatters={getQuestionDescription(item.questionId)}
                  />
                ))}
              </div>
            ) : !result.isComplete ? (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Incomplete analysis — answer the remaining questions to see strengths/risks.
              </p>
            ) : (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                No clear strengths detected.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h4 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
              Key Risk Factors
            </h4>
            {result.risksOrConstraints.length > 0 ? (
              <div className="mt-3 grid gap-3">
                {result.risksOrConstraints.slice(0, 2).map((item) => (
                  <InsightCard
                    key={`${item.questionId}-${item.optionId}`}
                    variant="risk"
                    title={getQuestionShortLabel(item.questionId, item.questionTitle)}
                    answer={item.optionLabel}
                    commentary={item.commentary}
                    whyMatters={getQuestionDescription(item.questionId)}
                  />
                ))}
              </div>
            ) : !result.isComplete ? (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Incomplete analysis — answer the remaining questions to see strengths/risks.
              </p>
            ) : (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                No major risks detected.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="all-insights" className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
          All Insights
        </h3>

        <details
          open
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <summary className="cursor-pointer text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-200">
            Strength Signals ({result.allInsights.strengths.length})
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.allInsights.strengths.length > 0 ? (
              result.allInsights.strengths.map((item) => (
                <InsightCard
                  key={`${item.questionId}-${item.optionId}`}
                  variant="strength"
                  title={getQuestionShortLabel(item.questionId, item.questionTitle)}
                  answer={item.optionLabel}
                  commentary={item.commentary}
                  whyMatters={getQuestionDescription(item.questionId)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No strength signals available.
              </p>
            )}
          </div>
        </details>

        <details className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <summary className="cursor-pointer text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-200">
            Needs Validation ({result.allInsights.needsValidation.length})
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.allInsights.needsValidation.length > 0 ? (
              result.allInsights.needsValidation.map((item) => (
                <InsightCard
                  key={`${item.questionId}-${item.optionId}`}
                  variant="neutral"
                  title={getQuestionShortLabel(item.questionId, item.questionTitle)}
                  answer={item.optionLabel}
                  commentary={item.commentary}
                  whyMatters={getQuestionDescription(item.questionId)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No needs-validation signals available.
              </p>
            )}
          </div>
        </details>

        <details
          open
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <summary className="cursor-pointer text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-200">
            Risk Signals ({result.allInsights.risks.length})
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {result.allInsights.risks.length > 0 ? (
              result.allInsights.risks.map((item) => (
                <InsightCard
                  key={`${item.questionId}-${item.optionId}`}
                  variant="risk"
                  title={getQuestionShortLabel(item.questionId, item.questionTitle)}
                  answer={item.optionLabel}
                  commentary={item.commentary}
                  whyMatters={getQuestionDescription(item.questionId)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">No risk signals available.</p>
            )}
          </div>
        </details>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
          Recommended Next Steps
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {actionCards.map((action) => (
            <article
              key={action.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <h4 className="text-sm font-semibold">{action.title}</h4>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{action.rationale}</p>
              {action.resources && action.resources.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600 dark:text-gray-300">
                  {action.resources.map((resource) => (
                    <li key={resource}>{resource}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
