type InsightCardVariant = 'strength' | 'risk' | 'neutral'

type InsightCardProps = {
  variant: InsightCardVariant
  title: string
  answer: string
  commentary: string
  whyMatters?: string
}

function variantIcon(variant: InsightCardVariant) {
  if (variant === 'strength') return '✓'
  if (variant === 'risk') return '⚠'
  return '•'
}

function variantClasses(variant: InsightCardVariant) {
  if (variant === 'strength') return 'text-green-700 dark:text-green-300'
  if (variant === 'risk') return 'text-red-700 dark:text-red-300'
  return 'text-amber-700 dark:text-amber-300'
}

export default function InsightCard({
  variant,
  title,
  answer,
  commentary,
  whyMatters,
}: InsightCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
      <p className="flex items-start gap-2 font-medium">
        <span aria-hidden className={`mt-0.5 ${variantClasses(variant)}`}>
          {variantIcon(variant)}
        </span>
        <span>{title}</span>
      </p>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Your answer: {answer}</p>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{commentary}</p>
      {whyMatters ? (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
          <span className="font-medium">Why this matters:</span> {whyMatters}
        </p>
      ) : null}
    </article>
  )
}
