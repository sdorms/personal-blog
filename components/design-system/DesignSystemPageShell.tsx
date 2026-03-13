import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  getSectionById,
  getSectionNeighbors,
  type DesignSystemSectionId,
} from '@/lib/design-system/navigation'

export default function DesignSystemPageShell({
  sectionId,
  children,
}: {
  sectionId: DesignSystemSectionId
  children: ReactNode
}) {
  const section = getSectionById(sectionId)
  const { previous, next } = getSectionNeighbors(sectionId)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4">
        <Link
          href="/design-system"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
        >
          ← Back to Design System Index
        </Link>
      </div>

      <header className="mb-10">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Internal
        </p>
        <h1 className="mt-2 text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 dark:text-gray-100">
          {section.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-300">
          {section.description}
        </p>
      </header>

      <section className="mt-6 space-y-6">{children}</section>

      <nav className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
        <div className="flex items-center justify-between gap-4">
          {previous ? (
            <Link
              href={previous.href}
              className="text-sm font-medium text-gray-700 hover:underline dark:text-gray-200"
            >
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={next.href}
              className="text-sm font-medium text-gray-700 hover:underline dark:text-gray-200"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </main>
  )
}
