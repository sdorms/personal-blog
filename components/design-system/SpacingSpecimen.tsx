import type { SpacingScaleToken, SpacingUsageToken } from '@/lib/design-system/spacing'

function sourceBadgeClasses(source: SpacingScaleToken['source']) {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

export function SpacingScaleSpecimen({ tokens }: { tokens: SpacingScaleToken[] }) {
  const maxPx = Math.max(...tokens.map((token) => token.px), 1)

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
              <th className="py-2 pr-4">Token</th>
              <th className="py-2 pr-4">Tailwind</th>
              <th className="py-2 pr-4">px</th>
              <th className="py-2 pr-4">rem</th>
              <th className="py-2 pr-4">Usage</th>
              <th className="py-2">Scale</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => {
              const widthPercent = Math.max(6, Math.round((token.px / maxPx) * 100))
              return (
                <tr key={token.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-100">
                    {token.name}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-gray-700 dark:text-gray-200">
                    {token.tailwind}
                  </td>
                  <td className="py-3 pr-4 text-gray-700 dark:text-gray-200">{token.px}</td>
                  <td className="py-3 pr-4 text-gray-700 dark:text-gray-200">{token.rem}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600 dark:text-gray-300">
                    {token.usage}
                  </td>
                  <td className="py-3">
                    <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-900">
                      <div
                        className="bg-primary-500 dark:bg-primary-400 h-3 rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}

function usagePreview(token: SpacingUsageToken) {
  if (token.id === 'usage-card-padding' || token.id === 'usage-card-padding-compact') {
    const outerPadding = token.id === 'usage-card-padding' ? 'p-6' : 'p-5'
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className={`${outerPadding}`}>
          <div className="rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
            Nested content
          </div>
        </div>
      </div>
    )
  }

  if (token.id === 'usage-section-stack' || token.id === 'usage-compact-stack') {
    const stackClass = token.id === 'usage-section-stack' ? 'space-y-6' : 'space-y-4'
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className={stackClass}>
          <div className="h-8 rounded-md bg-white dark:bg-gray-950" />
          <div className="h-8 rounded-md bg-white dark:bg-gray-950" />
          <div className="h-8 rounded-md bg-white dark:bg-gray-950" />
        </div>
      </div>
    )
  }

  if (token.id === 'usage-grid-gap' || token.id === 'usage-grid-gap-compact') {
    const gapClass = token.id === 'usage-grid-gap' ? 'gap-6' : 'gap-3'
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className={`grid grid-cols-2 ${gapClass}`}>
          <div className="h-10 rounded-md bg-white dark:bg-gray-950" />
          <div className="h-10 rounded-md bg-white dark:bg-gray-950" />
        </div>
      </div>
    )
  }

  if (token.id === 'usage-page-padding') {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 py-10">
          <div className="h-8 rounded-md bg-white dark:bg-gray-950" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
      <button
        type="button"
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
      >
        Inline control sample
      </button>
    </div>
  )
}

export default function SpacingSpecimen({ token }: { token: SpacingUsageToken }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{token.name}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{token.usage}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${sourceBadgeClasses(token.source)}`}
        >
          source: {token.source}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Token
        </p>
        <dl className="mt-2 grid gap-2 text-xs text-gray-700 sm:grid-cols-3 dark:text-gray-200">
          <div>
            <dt className="font-semibold">Tailwind</dt>
            <dd className="font-mono">{token.tailwind}</dd>
          </div>
          <div>
            <dt className="font-semibold">px</dt>
            <dd>{token.px}</dd>
          </div>
          <div>
            <dt className="font-semibold">rem</dt>
            <dd>{token.rem}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Example
        </p>
        <div className="mt-2">{usagePreview(token)}</div>
      </div>
    </article>
  )
}
