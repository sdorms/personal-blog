import type { Metadata } from 'next'
import Link from 'next/link'
import ModalDemo from '@/components/design-system/ModalDemo'
import { DESIGN_SYSTEM_SECTIONS } from '@/lib/design-system/navigation'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Internal design-system reference for foundational UI tokens and patterns.',
}

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Internal
        </p>
        <h1 className="font-pixel mt-2 text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Design System
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-300">
          Internal reference for foundational design tokens and UI patterns. Choose a section below
          to inspect detailed specimens and implementation guidance.
        </p>
      </header>

      <section className="mt-6 space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Sections
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Navigate each foundation independently for faster scanning and iteration.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {DESIGN_SYSTEM_SECTIONS.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <h3 className="text-xl leading-7 font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {section.description}
              </p>
              <Link
                href={section.href}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mt-3 inline-flex text-sm font-medium hover:underline"
              >
                Open section →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Component Preview
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Current reusable primitives that benefit from interactive review on this index page.
          </p>
        </div>

        <ModalDemo />
      </section>
    </main>
  )
}
