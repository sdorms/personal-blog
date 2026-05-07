import Button from '@/components/ui/Button'
import {
  BUTTON_SHARED_CLASSNAME,
  BUTTON_TEXT_SHARED_CLASSNAME,
  type ButtonToken,
} from '@/lib/design-system/buttons'

function sourceBadgeClasses(source: ButtonToken['source']) {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

function hoverFocusPreviewClasses(token: ButtonToken) {
  if (token.id === 'primary') {
    return 'bg-primary-600 outline-2 outline-accent outline-offset-2'
  }
  if (token.id === 'secondary') {
    return 'bg-subtle outline-2 outline-accent outline-offset-2'
  }
  if (token.id === 'ghost') {
    return 'bg-panel outline-2 outline-accent outline-offset-2'
  }
  if (token.id === 'danger') {
    return 'bg-danger-hover outline-2 outline-accent outline-offset-2'
  }
  return 'text-primary-600 outline-2 outline-accent outline-offset-2'
}

function getPreviewLabel(token: ButtonToken, state: 'default' | 'hover' | 'disabled') {
  if (token.id === 'text' || token.id === 'text-back') {
    return 'Read more'
  }
  if (state === 'default') return 'Default'
  if (state === 'hover') return 'Hover / Focus'
  return 'Disabled'
}

function getSharedClassName(token: ButtonToken) {
  return token.isTextStyle ? BUTTON_TEXT_SHARED_CLASSNAME : BUTTON_SHARED_CLASSNAME
}

export default function ButtonSpecimen({ token }: { token: ButtonToken }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-h5 text-gray-900 dark:text-gray-100">{token.name}</h3>
          <p className="text-body-sm mt-1 text-gray-600 dark:text-gray-300">{token.usage}</p>
        </div>
        <span
          className={`text-body-xs inline-flex items-center rounded-full px-2 py-0.5 ring-1 ring-inset ${sourceBadgeClasses(token.source)}`}
        >
          source: {token.source}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-eyebrow text-gray-500 dark:text-gray-400">className</p>
        <code className="text-body-xs mt-1 block break-all text-gray-700 dark:text-gray-200">
          {`${getSharedClassName(token)} ${token.className}`.trim()}
        </code>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
        <p className="text-eyebrow text-gray-500 dark:text-gray-400">States</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button variant={token.id}>{getPreviewLabel(token, 'default')}</Button>
          <Button variant={token.id} className={hoverFocusPreviewClasses(token)}>
            {getPreviewLabel(token, 'hover')}
          </Button>
          <Button variant={token.id} disabled>
            {getPreviewLabel(token, 'disabled')}
          </Button>
        </div>
      </div>
    </article>
  )
}
