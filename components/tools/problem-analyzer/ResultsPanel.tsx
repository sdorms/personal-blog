import { useEffect, useState } from 'react'
import InsightCard from '@/components/tools/problem-analyzer/InsightCard'
import ScreenDiagnosticCard from '@/components/tools/problem-analyzer/ScreenDiagnosticCard'
import { PROBLEM_ANALYZER_SCHEMA } from '@/lib/problem-analyzer/schema'
import type {
  BucketCounts,
  GroupedAllInsights,
  InsightItem,
  OverallTier,
  ScreenDiagnostic,
} from '@/lib/problem-analyzer/score'

export type ResultModel = {
  problemText: string
  tier: OverallTier
  percent: number
  isComplete: boolean
  strengths: InsightItem[]
  risksOrConstraints: InsightItem[]
  allInsights: GroupedAllInsights
  bucketCounts: BucketCounts
  screenDiagnostics: ScreenDiagnostic[]
  summaryMessage: string
  conf: 'high' | 'med' | 'low' | 'vlow'
  uncertainTitles: string[]
  uncertainQuestionIds: string[]
}

type ActionCard = {
  title: string
  rationale: string
  resources?: string[]
}

function signalStrengthLabel(tier: OverallTier) {
  if (tier === 'strong') return 'High'
  if (tier === 'mixed') return 'Medium'
  return 'Weak'
}

function signalInterpretation(tier: OverallTier) {
  if (tier === 'strong') return 'Signal quality is strong. Worth validating deeper.'
  if (tier === 'mixed') return 'The problem shows potential, but there are risk factors to address.'
  return 'Signal is weak. Address the biggest unknowns before building.'
}

function meterClasses(tier: OverallTier) {
  if (tier === 'strong') return 'bg-green-500 dark:bg-green-400'
  if (tier === 'mixed') return 'bg-amber-500 dark:bg-amber-400'
  return 'bg-red-500 dark:bg-red-400'
}

function getQuestion(questionId: string) {
  return PROBLEM_ANALYZER_SCHEMA.questions[questionId]
}

function getQuestionShortLabel(questionId: string, fallback: string): string {
  return getQuestion(questionId)?.shortLabel ?? fallback
}

function getQuestionDescription(questionId: string): string | undefined {
  return getQuestion(questionId)?.description
}

function buildRecommendedActions(result: ResultModel): ActionCard[] {
  const actions: ActionCard[] = []
  const confidenceIsLow = result.conf === 'low' || result.conf === 'vlow'
  const evidenceScreen =
    result.screenDiagnostics.find((screen) => screen.screenId === 'validation') ??
    result.screenDiagnostics.find((screen) => screen.title.toLowerCase().includes('evidence'))

  if (result.tier === 'weak') {
    actions.push({
      title: 'Validate the problem before building',
      rationale:
        'The current signal is weak, so building now is likely premature. Focus first on proving this pain is urgent and recurring for a specific audience.',
      resources: ['The Mom Test'],
    })
  } else if (result.tier === 'mixed') {
    actions.push({
      title: 'Investigate the biggest unknowns',
      rationale:
        'Signal quality is mixed. Prioritize the highest-risk assumptions and resolve them with direct customer evidence before committing to solution scope.',
      resources: ['The Mom Test', 'Sequoia PMF'],
    })
  } else {
    actions.push({
      title: 'Design a lightweight MVP test',
      rationale:
        'Signal quality is strong enough to test solution behavior. Keep the first experiment narrow so you can validate demand with minimal implementation overhead.',
      resources: ['YC Startup School'],
    })
  }

  const topRisk = result.risksOrConstraints[0]
  if (topRisk) {
    const shortLabel = getQuestionShortLabel(topRisk.questionId, topRisk.questionTitle)
    actions.push({
      title: `Validate ${shortLabel}`,
      rationale: `You selected "${topRisk.optionLabel}" for this area. That response indicates elevated risk and should be validated before scaling product or go-to-market decisions.`,
    })
  }

  if (result.uncertainQuestionIds.length > 0 || confidenceIsLow) {
    actions.push({
      title: 'Run structured customer discovery interviews',
      rationale:
        result.uncertainTitles.length > 0
          ? `Uncertainty remains around ${result.uncertainTitles.join(', ')}. This lowers confidence, so use structured interviews to replace assumptions with direct evidence.`
          : 'Current confidence is low. Run structured interviews to tighten assumptions and improve decision quality before building.',
      resources: ['The Mom Test'],
    })
  }

  if (
    evidenceScreen &&
    (evidenceScreen.screenTier === 'mixed' || evidenceScreen.screenTier === 'weak')
  ) {
    actions.push({
      title: 'Collect stronger validation evidence',
      rationale:
        'Evidence quality is not yet strong enough for high-confidence execution. Prioritize stronger proof such as paid pilots, LOIs, or repeated behavioral signals.',
      resources: ['Sequoia PMF'],
    })
  }

  if (result.tier === 'strong' && actions.length < 5) {
    actions.push({
      title: 'Run a simple MVP experiment',
      rationale:
        'You have enough positive signal to run a focused experiment. Define clear success criteria and test one narrow outcome with real users.',
      resources: ['YC Startup School'],
    })
  }

  const fallbackActions: ActionCard[] = [
    {
      title: 'Define success criteria for the next validation cycle',
      rationale:
        'Set explicit pass/fail criteria for your next round of validation so decisions remain evidence-based and comparable across iterations.',
    },
    {
      title: 'Prioritize one high-impact assumption per sprint',
      rationale:
        'Concentrating on a single high-impact unknown each cycle improves learning velocity and reduces execution drift.',
    },
  ]

  for (const fallback of fallbackActions) {
    if (actions.length >= 3) break
    actions.push(fallback)
  }

  return actions.slice(0, 5)
}

export default function ResultsPanel({
  result,
  onProblemTextChange,
}: {
  result: ResultModel
  onProblemTextChange?: (value: string) => void
}) {
  const [isEditingProblem, setIsEditingProblem] = useState(false)
  const [draftProblemText, setDraftProblemText] = useState(result.problemText)

  useEffect(() => {
    if (!isEditingProblem) {
      setDraftProblemText(result.problemText)
    }
  }, [isEditingProblem, result.problemText])

  const saveProblemText = () => {
    onProblemTextChange?.(draftProblemText)
    setIsEditingProblem(false)
  }

  const cancelProblemEdit = () => {
    setDraftProblemText(result.problemText)
    setIsEditingProblem(false)
  }

  const meterWidthPercent = Math.max(0, Math.min(100, Math.round(result.percent * 100)))
  const actionCards = buildRecommendedActions(result)

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Problem Insights</h2>
          {!isEditingProblem ? (
            <button
              type="button"
              onClick={() => setIsEditingProblem(true)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              Edit
            </button>
          ) : null}
        </div>

        {!isEditingProblem ? (
          <p className="mt-3 max-w-[70ch] text-base text-gray-800 dark:text-gray-100">
            {result.problemText || 'No problem statement provided yet.'}
          </p>
        ) : (
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveProblemText}
                className="rounded-xl bg-gray-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-gray-100 dark:text-black"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelProblemEdit}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium dark:border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mt-3 max-w-[600px]">
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
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
        <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
          Signal strength: {signalStrengthLabel(result.tier)}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
          {signalInterpretation(result.tier)}
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
