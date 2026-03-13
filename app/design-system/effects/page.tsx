import type { Metadata } from 'next'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'
import EffectSpecimen from '@/components/design-system/EffectSpecimen'
import { EFFECT_TOKENS } from '@/lib/design-system/effects'

export const metadata: Metadata = {
  title: 'Design System - Surfaces & Effects',
  description: 'Radius, border, shadow, and surface foundation reference.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="effects">
      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Surfaces & Effects"
          description="Approved foundation defaults for cards, controls, and nested panel shells."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {EFFECT_TOKENS.map((token) => (
            <EffectSpecimen key={token.id} token={token} />
          ))}
        </div>
      </section>
    </DesignSystemPageShell>
  )
}
