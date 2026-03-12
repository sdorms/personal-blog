import type { TypographyToken } from '@/lib/design-system/typography'

function familyBadgeClasses(family: TypographyToken['family']) {
  if (family === 'editorial') {
    return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30'
  }
  if (family === 'both') {
    return 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30'
  }
  return 'bg-gray-100 text-gray-700 ring-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700'
}

function sourceBadgeClasses(source: TypographyToken['source']) {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

export default function TypographySpecimen({ token }: { token: TypographyToken }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{token.name}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{token.usage}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${familyBadgeClasses(token.family)}`}
          >
            family: {token.family}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${sourceBadgeClasses(token.source)}`}
          >
            source: {token.source}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          className
        </p>
        <code className="mt-1 block text-xs break-all text-gray-700 dark:text-gray-200">
          {token.className}
        </code>
      </div>

      {token.family === 'both' ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Editorial Preview
            </p>
            <p
              className={`font-pixel mt-2 break-words text-gray-900 dark:text-gray-100 ${token.className}`}
            >
              {token.sample}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              UI Preview
            </p>
            <p className={`mt-2 break-words text-gray-900 dark:text-gray-100 ${token.className}`}>
              {token.sample}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Live Preview
          </p>
          <p className={`mt-2 break-words text-gray-900 dark:text-gray-100 ${token.className}`}>
            {token.sample}
          </p>
        </div>
      )}
    </article>
  )
}
