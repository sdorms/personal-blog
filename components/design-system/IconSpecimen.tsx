'use client'

import Icon, { Icons } from '@/components/ui/Icon'
import {
  ICON_LIBRARY,
  ICON_SIZE_TOKENS,
  SEMANTIC_ICON_TOKENS,
  type SemanticIconToken,
} from '@/lib/design-system/icons'

const iconNames = Object.keys(Icons) as Array<keyof typeof Icons>

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
        <h3 className="text-h5 text-heading dark:text-gray-100">Icon Library</h3>

        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {iconNames.map((iconName) => (
            <div key={iconName} className="flex items-center justify-center">
              <Icon name={iconName} />
            </div>
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
    </div>
  )
}
