import type { EffectToken } from '@/lib/design-system/effects'

function sourceBadgeClasses(source: EffectToken['source']) {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

function effectPreview(token: EffectToken) {
  if (token.id === 'radius-card') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="rounded-md bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          Card shell sample
        </div>
      </div>
    )
  }

  if (token.id === 'radius-control') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200">
        Control shell sample
      </div>
    )
  }

  if (token.id === 'surface-panel') {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="rounded-md border border-gray-200 bg-white p-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
          Nested panel content
        </div>
      </div>
    )
  }

  if (token.id === 'surface-card') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="text-xs text-gray-600 dark:text-gray-300">Card surface sample</div>
      </div>
    )
  }

  if (token.id === 'border-default') {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900">
          Bordered container
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="text-xs text-gray-600 dark:text-gray-300">Shadow sample</div>
    </div>
  )
}

export default function EffectSpecimen({ token }: { token: EffectToken }) {
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
          className
        </p>
        <code className="mt-1 block text-xs break-all text-gray-700 dark:text-gray-200">
          {token.className}
        </code>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Sample
        </p>
        <div className="mt-2">{effectPreview(token)}</div>
      </div>
    </article>
  )
}
