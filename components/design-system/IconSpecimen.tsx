'use client'

import Icon from '@/components/ui/Icon'
import {
  ICON_LIBRARY,
  ICON_SAMPLE_ROW,
  ICON_SIZE_TOKENS,
  SEMANTIC_ICON_TOKENS,
  type SemanticIconToken,
} from '@/lib/design-system/icons'

function sourceBadgeClasses(source: 'existing' | 'normalized' | 'new') {
  if (source === 'existing') {
    return 'bg-success-bg text-success ring-success-border'
  }
  if (source === 'new') {
    return 'bg-warning-bg text-warning ring-warning-border'
  }
  return 'bg-panel text-accent ring-border'
}

function semanticContainerClasses(id: SemanticIconToken['id']) {
  if (id === 'icon-success') {
    return 'border-success-border bg-success-bg text-success'
  }
  if (id === 'icon-warning') {
    return 'border-warning-border bg-warning-bg text-warning'
  }
  if (id === 'icon-danger') {
    return 'border-danger-border bg-danger-bg text-danger'
  }
  return 'border-border bg-panel text-accent'
}

export default function IconSpecimen() {
  return (
    <div className="space-y-4">
      <article className="border-border bg-card rounded-2xl border p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-h5 text-heading dark:text-gray-100">Library</h3>
        <p className="text-body-sm text-body mt-1 dark:text-gray-300">
          Library in use: {ICON_LIBRARY.name}
        </p>
        <p className="text-caption text-muted mt-1 dark:text-gray-300">
          Package: <code className="font-mono">{ICON_LIBRARY.packageName}</code>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ICON_SAMPLE_ROW.map((iconName) => (
            <span
              key={iconName}
              className="border-border bg-panel text-body inline-flex h-9 w-9 items-center justify-center rounded-xl border dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <Icon name={iconName} />
            </span>
          ))}
        </div>
      </article>

      <article className="border-border bg-card rounded-2xl border p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-h5 text-heading dark:text-gray-100">Size Scale</h3>
        <p className="text-body-sm text-body mt-1 dark:text-gray-300">
          Approved icon sizes for compact, default, and emphasis contexts.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {ICON_SIZE_TOKENS.map((token) => (
            <div
              key={token.id}
              className="border-border rounded-xl border p-3 dark:border-gray-800"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-body-sm text-heading dark:text-gray-100">{token.name}</p>
                <span
                  className={`text-body-xs inline-flex items-center rounded-full px-2 py-0.5 ring-1 ring-inset ${sourceBadgeClasses(token.source)}`}
                >
                  {token.source}
                </span>
              </div>
              <p className="text-caption text-muted mt-1 dark:text-gray-300">{token.usage}</p>
              <p className="text-body-xs text-muted mt-2 font-mono dark:text-gray-300">
                {token.className}
              </p>
              <div className="border-divider bg-panel mt-3 rounded-lg border p-3 dark:border-gray-800 dark:bg-gray-900">
                <Icon name="info" className={token.className} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="border-border bg-card rounded-2xl border p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-h5 text-heading dark:text-gray-100">Semantic Mappings</h3>
        <p className="text-body-sm text-body mt-1 dark:text-gray-300">
          Centralized icon mappings for product state semantics.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SEMANTIC_ICON_TOKENS.map((token) => (
            <div
              key={token.id}
              className={`rounded-xl border p-3 ${semanticContainerClasses(token.id)}`}
            >
              <div className="flex items-center gap-2">
                <Icon name={token.iconName} />
                <p className="text-body-sm">{token.name}</p>
              </div>
              <p className="text-caption mt-1 opacity-90">{token.usage}</p>
              <p className="text-body-xs mt-2 font-mono opacity-80">{token.iconName}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
