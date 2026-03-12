import { BUTTON_SHARED_CLASSNAME, type ButtonToken } from '@/lib/design-system/buttons'

function sourceBadgeClasses(source: ButtonToken['source']) {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

function composedClassName(token: ButtonToken) {
  return token.isLinkStyle ? token.className : `${BUTTON_SHARED_CLASSNAME} ${token.className}`
}

function hoverFocusPreviewClasses(token: ButtonToken) {
  if (token.id === 'primary') {
    return 'bg-primary-600 outline-2 outline-primary-500 outline-offset-2'
  }
  if (token.id === 'secondary') {
    return 'bg-gray-200 dark:bg-gray-800 outline-2 outline-primary-500 outline-offset-2'
  }
  if (token.id === 'ghost') {
    return 'bg-gray-100 dark:bg-gray-900 outline-2 outline-primary-500 outline-offset-2'
  }
  if (token.id === 'text-link') {
    return 'text-primary-600 dark:text-primary-400 outline-2 outline-primary-500 outline-offset-2'
  }
  return 'bg-red-700 outline-2 outline-red-600 outline-offset-2'
}

export default function ButtonSpecimen({ token }: { token: ButtonToken }) {
  const className = composedClassName(token)

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
          States
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button type="button" className={className}>
            Default
          </button>
          <button
            type="button"
            className={`${className} ${hoverFocusPreviewClasses(token)} outline`}
          >
            Hover / Focus
          </button>
          <button type="button" className={className} disabled>
            Disabled
          </button>
        </div>
      </div>
    </article>
  )
}
