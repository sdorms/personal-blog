'use client'

import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  WarningCircle as WarningCircleIcon,
  XCircle as XCircleIcon,
  type Icon,
} from '@phosphor-icons/react'
import {
  ICON_LIBRARY,
  ICON_SAMPLE_ROW,
  ICON_SIZE_TOKENS,
  SEMANTIC_ICON_TOKENS,
  type SemanticIconToken,
} from '@/lib/design-system/icons'

const ICON_COMPONENTS: Record<SemanticIconToken['iconName'], Icon> = {
  CheckCircleIcon,
  WarningCircleIcon,
  XCircleIcon,
  InfoIcon,
}

function sourceBadgeClasses(source: 'existing' | 'normalized' | 'new') {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

function semanticContainerClasses(id: SemanticIconToken['id']) {
  if (id === 'icon-success') {
    return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300'
  }
  if (id === 'icon-warning') {
    return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
  }
  if (id === 'icon-danger') {
    return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
  }
  return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
}

export default function IconSpecimen() {
  const SampleIcon = InfoIcon

  return (
    <div className="space-y-4">
      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Library</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Library in use: {ICON_LIBRARY.name}
        </p>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          Package: <code className="font-mono">{ICON_LIBRARY.packageName}</code>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ICON_SAMPLE_ROW.map((iconName) => {
            const IconComponent = ICON_COMPONENTS[iconName]
            return (
              <span
                key={iconName}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                <IconComponent className="h-5 w-5" aria-hidden="true" />
              </span>
            )
          })}
        </div>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Size Scale</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Approved icon sizes for compact, default, and emphasis contexts.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {ICON_SIZE_TOKENS.map((token) => (
            <div
              key={token.id}
              className="rounded-xl border border-gray-200 p-3 dark:border-gray-800"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{token.name}</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${sourceBadgeClasses(token.source)}`}
                >
                  {token.source}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{token.usage}</p>
              <p className="mt-2 font-mono text-xs text-gray-600 dark:text-gray-300">
                {token.className}
              </p>
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <SampleIcon className={token.className} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Semantic Mappings
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Centralized icon mappings for product state semantics.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SEMANTIC_ICON_TOKENS.map((token) => {
            const IconComponent = ICON_COMPONENTS[token.iconName]
            return (
              <div
                key={token.id}
                className={`rounded-xl border p-3 ${semanticContainerClasses(token.id)}`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                  <p className="text-sm font-semibold">{token.name}</p>
                </div>
                <p className="mt-1 text-xs opacity-90">{token.usage}</p>
                <p className="mt-2 font-mono text-xs opacity-80">{token.iconName}</p>
              </div>
            )
          })}
        </div>
      </article>
    </div>
  )
}
