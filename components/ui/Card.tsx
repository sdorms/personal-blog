import type { ReactNode } from 'react'

type CardPadding = 'default' | 'compact'

const PADDING_CLASS: Record<CardPadding, string> = {
  default: 'p-6',
  compact: 'p-5',
}

export default function Card({
  children,
  className,
  padding = 'default',
}: {
  children: ReactNode
  className?: string
  padding?: CardPadding
}) {
  return (
    <div
      className={[
        'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
        PADDING_CLASS[padding],
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}
