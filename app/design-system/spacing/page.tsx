import type { Metadata } from 'next'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'
import SpacingSpecimen, { SpacingScaleSpecimen } from '@/components/design-system/SpacingSpecimen'
import { SPACING_SCALE_TOKENS, SPACING_USAGE_TOKENS } from '@/lib/design-system/spacing'

export const metadata: Metadata = {
  title: 'Design System - Spacing',
  description: 'Spacing scale and usage pattern reference.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="spacing">
      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Spacing Scale"
          description="Approved v1 spacing values from smallest to largest for consistent rhythm."
        />
        <SpacingScaleSpecimen tokens={SPACING_SCALE_TOKENS} />
      </section>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Recommended Usage Patterns"
          description="Practical defaults for card padding, layout stacks, grid spacing, page padding, and controls."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {SPACING_USAGE_TOKENS.map((token) => (
            <SpacingSpecimen key={token.id} token={token} />
          ))}
        </div>
      </section>
    </DesignSystemPageShell>
  )
}
