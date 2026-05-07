import type { Metadata } from 'next'
import ButtonSpecimen from '@/components/design-system/ButtonSpecimen'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'
import { BUTTON_SHARED_CLASSNAME, BUTTON_TOKENS } from '@/lib/design-system/buttons'

export const metadata: Metadata = {
  title: 'Design System - Buttons',
  description: 'Button variant and state reference.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="buttons">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Shared Defaults
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Shared defaults for non-link variants:{' '}
          <code className="font-mono text-xs">{BUTTON_SHARED_CLASSNAME}</code>
        </p>
      </div>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Buttons"
          description="Primary, secondary, ghost, text CTA, and destructive patterns with default, hover/focus, and disabled examples."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {BUTTON_TOKENS.map((token) => (
            <ButtonSpecimen key={token.id} token={token} />
          ))}
        </div>
      </section>
    </DesignSystemPageShell>
  )
}
