import { useEffect, useState } from 'react'
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
  strategyPath: StrategyPath
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

export default function ResultsPanel({
  result,
  onProblemTextChange,
  onAudienceTextChange,
}: {
  result: ResultModel
  onProblemTextChange?: (value: string) => void
  onAudienceTextChange?: (value: string) => void
}) {
  const [isEditingContext, setIsEditingContext] = useState(false)
  const [draftProblemText, setDraftProblemText] = useState(result.problemText)
  const [draftAudienceText, setDraftAudienceText] = useState(result.audienceText)

  useEffect(() => {
    if (!isEditingContext) {
      setDraftProblemText(result.problemText)
      setDraftAudienceText(result.audienceText)
    }
  }, [isEditingContext, result.audienceText, result.problemText])

  const saveContext = () => {
    onProblemTextChange?.(draftProblemText)
    onAudienceTextChange?.(draftAudienceText)
    setIsEditingContext(false)
  }

  const cancelContextEdit = () => {
    setDraftProblemText(result.problemText)
    setDraftAudienceText(result.audienceText)
    setIsEditingContext(false)
  }

  const meterWidthPercent = Math.max(0, Math.min(100, Math.round(result.percent * 100)))
  const actionCards: ActionCard[] = buildRecommendedActions(result)
  const lowConfidenceCount = Object.values(result.confidenceByQuestion).filter(
    (value) => value === 'low'
  ).length

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Problem Insights
        </p>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-[70ch] space-y-2">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Problem: {result.problemText || 'No problem statement provided yet.'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Audience: {result.audienceText || 'No audience specified yet.'}
            </p>
          </div>

          {!isEditingContext ? (
            <button
              type="button"
              onClick={() => setIsEditingContext(true)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Edit
            </button>
          ) : null}
        </div>

        {isEditingContext ? (
          <div className="mt-3 space-y-3">
            <label htmlFor="resultProblemText" className="text-sm font-medium">
              Problem statement
            </label>
            <textarea
              id="resultProblemText"
              value={draftProblemText}
              onChange={(e) => setDraftProblemText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
            />
            <label htmlFor="resultAudienceText" className="text-sm font-medium">
              Who experiences this problem?
            </label>
            <textarea
              id="resultAudienceText"
              value={draftAudienceText}
              onChange={(e) => setDraftAudienceText(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveContext}
                className="rounded-xl bg-gray-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-gray-100 dark:text-black"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelContextEdit}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium dark:border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        <h2 className="mt-4 text-3xl font-bold tracking-tight">{result.verdictLabel}</h2>

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

        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Strategy: {strategyLabel(result.strategyPath)}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
          {result.strategyDescription}
        </p>

        <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-100">
          Next focus: {formatNextFocus(result.nextFocus)}
        </p>
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
          Driven by: {driversSummary(result.drivers)}
        </p>

        <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
          Confidence: {confidenceLabel(result.conf)}
          {lowConfidenceCount > 0 ? ` · ${lowConfidenceCount} low-confidence answers` : ''}
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
