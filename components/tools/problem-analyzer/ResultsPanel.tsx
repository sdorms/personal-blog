import type { InsightItem, OverallTier } from '@/lib/problem-analyzer/score'

export type ResultModel = {
  tier: OverallTier
  percent: number
  isComplete: boolean
  strengthsKind: 'strengths' | 'signals'
  risksKind: 'risks' | 'constraints'
  strengths: InsightItem[]
  risksOrConstraints: InsightItem[]
  conf: 'high' | 'med' | 'low' | 'vlow'
  uncertainTitles: string[]
}

function tierLabel(tier: OverallTier) {
  if (tier === 'strong') return 'Strong Problem Signal'
  if (tier === 'mixed') return 'Mixed Problem Signal'
  return 'Weak Problem Signal'
}

function confidenceLabel(conf: ResultModel['conf']) {
  if (conf === 'high') return 'High'
  if (conf === 'med') return 'Medium'
  if (conf === 'low') return 'Low'
  return 'Very low'
}

function strengthsHeading(kind: ResultModel['strengthsKind']) {
  return kind === 'strengths' ? 'Strengths' : 'Most Promising Signals'
}

function risksHeading(kind: ResultModel['risksKind']) {
  return kind === 'risks' ? 'Primary Risks' : 'Top Constraints'
}

function summaryText(result: ResultModel) {
  const tierLine =
    result.tier === 'strong'
      ? 'Signal quality is currently strong.'
      : result.tier === 'mixed'
        ? 'Signal quality is currently mixed.'
        : 'Signal quality is currently weak.'
  const pressureLine =
    result.risksKind === 'risks'
      ? 'You have at least one primary risk that needs mitigation first.'
      : 'No primary risks were detected, but constraints still require validation.'
  const confidenceLine = `Current confidence is ${confidenceLabel(result.conf).toLowerCase()}.`
  return `${tierLine} ${pressureLine} ${confidenceLine}`
}

function nextActions(result: ResultModel) {
  const actions: string[] = []
  const topRiskOrConstraint = result.risksOrConstraints[0]

  if (topRiskOrConstraint) {
    actions.push(`Resolve: ${topRiskOrConstraint.questionTitle}.`)
  }
  if (result.uncertainTitles.length > 0) {
    actions.push(`Run targeted interviews focused on: ${result.uncertainTitles.join(', ')}.`)
  }
  if (result.tier === 'weak') {
    actions.push('Do not build yet. Gather stronger evidence before implementation.')
  }
  if (actions.length === 0) {
    actions.push('Continue validation and tighten evidence on the highest-priority signals.')
  }

  return actions
}

export default function ResultsPanel({ result }: { result: ResultModel }) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-xl font-semibold">{tierLabel(result.tier)}</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Score: {Math.round(result.percent * 100)}%
        </p>
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{summaryText(result)}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
            {strengthsHeading(result.strengthsKind)}
          </h3>
          {result.strengths.length > 0 ? (
            <ul className="mt-3 space-y-3 text-sm">
              {result.strengths.slice(0, 3).map((item) => (
                <li
                  key={`${item.questionId}-${item.optionId}`}
                  className="rounded-xl border border-gray-200 p-3 dark:border-gray-800"
                >
                  <p className="font-medium">{item.questionTitle}</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{item.commentary}</p>
                </li>
              ))}
            </ul>
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
          <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
            {risksHeading(result.risksKind)}
          </h3>
          {result.risksOrConstraints.length > 0 ? (
            <ul className="mt-3 space-y-3 text-sm">
              {result.risksOrConstraints.slice(0, 2).map((item) => (
                <li
                  key={`${item.questionId}-${item.optionId}`}
                  className="rounded-xl border border-gray-200 p-3 dark:border-gray-800"
                >
                  <p className="font-medium">{item.questionTitle}</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{item.commentary}</p>
                </li>
              ))}
            </ul>
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

      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
          Confidence Overlay
        </h3>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
          Confidence: {confidenceLabel(result.conf)}
        </p>
        {result.uncertainTitles.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
            {result.uncertainTitles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Uncertain answers: None</p>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
          Next Actions
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-200">
          {nextActions(result).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
