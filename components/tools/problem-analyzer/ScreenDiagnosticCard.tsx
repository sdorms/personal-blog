import type { ScreenDiagnostic } from '@/lib/problem-analyzer/score'

function tierLabel(tier: ScreenDiagnostic['screenTier']) {
  if (tier === 'strong') return 'Strong'
  if (tier === 'mixed') return 'Mixed'
  return 'Weak'
}

function tierColorClasses(tier: ScreenDiagnostic['screenTier']) {
  if (tier === 'strong') return 'bg-green-500 dark:bg-green-400'
  if (tier === 'mixed') return 'bg-amber-500 dark:bg-amber-400'
  return 'bg-red-500 dark:bg-red-400'
}

export default function ScreenDiagnosticCard({ diagnostic }: { diagnostic: ScreenDiagnostic }) {
  const widthPercent = Math.max(0, Math.min(100, Math.round(diagnostic.screenPercent * 100)))

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h3 className="text-base font-semibold">{diagnostic.title}</h3>

      <p className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
        <span className={`h-2.5 w-2.5 rounded-full ${tierColorClasses(diagnostic.screenTier)}`} />
        <span>{tierLabel(diagnostic.screenTier)}</span>
      </p>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className={`h-full transition-[width] ${tierColorClasses(diagnostic.screenTier)}`}
          style={{ width: `${widthPercent}%` }}
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={widthPercent}
          aria-label={`${diagnostic.title} status ${tierLabel(diagnostic.screenTier)}`}
        />
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-gray-700 dark:text-gray-200">
        <div className="flex items-center justify-between">
          <dt>Strong signals</dt>
          <dd className="font-semibold">{diagnostic.strongCount}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Needs validation</dt>
          <dd className="font-semibold">{diagnostic.neutralCount}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Risk signals</dt>
          <dd className="font-semibold">{diagnostic.riskCount}</dd>
        </div>
      </dl>

      {diagnostic.explanation ? (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{diagnostic.explanation}</p>
      ) : null}
    </article>
  )
}
