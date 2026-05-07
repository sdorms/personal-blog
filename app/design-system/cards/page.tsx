import type { Metadata } from 'next'
import LegacyContentCard from '@/components/Card'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Design System - Cards',
  description: 'Core card primitive and existing content card reference.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="cards">
      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Core Card"
          description="Reusable default shell for grouped product/tool UI sections."
        />

        <Card>
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Default Rules
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-200">
            <li>
              Border: <code className="font-mono">border border-gray-200 dark:border-gray-800</code>
            </li>
            <li>
              Surface: <code className="font-mono">bg-white dark:bg-gray-950</code>
            </li>
            <li>
              Radius: <code className="font-mono">rounded-2xl</code>
            </li>
            <li>No shadow</li>
            <li>
              Default padding: <code className="font-mono">p-6</code>
            </li>
            <li>
              Optional compact padding: <code className="font-mono">p-5</code>
            </li>
          </ul>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Default Usage Example
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Use the core card shell for settings groups, tool sections, and structured UI
              containers.
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-medium">Revenue Inputs</p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                Target ARR, price, and conversion assumptions
              </p>
            </div>
          </Card>

          <Card padding="compact">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Compact Usage Example
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Use compact padding where density is important but structure should stay consistent.
            </p>
            <div className="mt-4 grid gap-2">
              <div className="rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-800">
                Metric A: 42
              </div>
              <div className="rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-800">
                Metric B: 17
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Existing Content Card"
          description="Current composed editorial card used for article/project/content previews. This remains distinct from the core shell."
        />

        <Card>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Component: <code className="font-mono">components/Card.tsx</code>
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            This is an existing composed pattern with image/header/body/CTA behavior. It is not the
            same primitive as the core product card shell.
          </p>
          <div className="-m-4 mt-4 flex flex-wrap">
            <LegacyContentCard
              title="Designing for Leverage"
              description="Representative example of the current editorial content card pattern for post/project previews."
              imgSrc="/static/images/site_screenshot.png"
              href="/design-system"
            />
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Guidance"
          description="When to use each card pattern in v1."
        />

        <Card>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200">
            <li>
              Use Core Card for grouped product UI, tool panels, and contained interface sections.
            </li>
            <li>Use Existing Content Card for editorial/content previews and list layouts.</li>
            <li>
              Keep diagnostic/result/insight cards as local patterns for now; do not promote them to
              base primitives yet.
            </li>
          </ul>
        </Card>
      </section>
    </DesignSystemPageShell>
  )
}
