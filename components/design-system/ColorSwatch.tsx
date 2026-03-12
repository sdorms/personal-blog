import type { ColorToken, PaletteScale, PaletteSwatch } from '@/lib/design-system/colors'

function sourceBadgeClasses(source: ColorToken['source']) {
  if (source === 'existing') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
  }
  if (source === 'new') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30'
  }
  return 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30'
}

function PaletteItem({ swatch }: { swatch: PaletteSwatch }) {
  return (
    <div className="space-y-2">
      <div
        className={`h-10 rounded-lg border border-gray-200 dark:border-gray-800 ${swatch.className}`}
      />
      <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{swatch.name}</p>
    </div>
  )
}

export function PaletteScaleCard({ scale }: { scale: PaletteScale }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{scale.title}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{scale.usage}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {scale.swatches.map((swatch) => (
          <PaletteItem key={swatch.id} swatch={swatch} />
        ))}
      </div>
    </article>
  )
}

function previewByCategory(token: ColorToken) {
  if (token.category === 'semantic') {
    return (
      <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${token.className}`}>
        Example status: Validation state is highlighted clearly.
      </div>
    )
  }

  if (token.category === 'text') {
    if (token.id === 'text-inverse') {
      return (
        <div className="dark:bg-primary-700 rounded-lg bg-gray-900 px-3 py-2">
          <p className={`text-sm ${token.className}`}>Inverse text preview on dark background.</p>
        </div>
      )
    }
    return <p className={`text-sm ${token.className}`}>Sample text preview for this token.</p>
  }

  if (token.category === 'surface') {
    return (
      <div
        className={`rounded-lg border border-gray-200 p-3 dark:border-gray-800 ${token.className}`}
      >
        <div className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
          Nested content sample
        </div>
      </div>
    )
  }

  if (token.category === 'border') {
    return (
      <div className="space-y-3">
        <div
          className={`rounded-lg border bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900 ${token.className}`}
        >
          Border preview block
        </div>
        <div className={`border-t ${token.className}`} />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${token.className}`}
    >
      Action sample
    </button>
  )
}

export default function ColorSwatch({ token }: { token: ColorToken }) {
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
          Live Preview
        </p>
        <div className="mt-2">{previewByCategory(token)}</div>
      </div>
    </article>
  )
}
