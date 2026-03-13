import type { Metadata } from 'next'
import ColorSwatch, { PaletteScaleCard } from '@/components/design-system/ColorSwatch'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'
import { COLOR_PALETTE_SCALES, COLOR_TOKEN_GROUPS } from '@/lib/design-system/colors'

export const metadata: Metadata = {
  title: 'Design System - Colors',
  description: 'Palette and semantic color reference.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="colors">
      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Palette"
          description="Base scales for brand accents and neutral UI structure."
        />
        <div className="grid gap-4">
          {COLOR_PALETTE_SCALES.map((scale) => (
            <PaletteScaleCard key={scale.id} scale={scale} />
          ))}
        </div>
      </section>

      {COLOR_TOKEN_GROUPS.filter((group) => group.id !== 'button').map((group) => (
        <section key={group.id} className="space-y-4">
          <DesignSystemSectionHeader title={group.title} description={group.description} />

          <div className="grid gap-4 md:grid-cols-2">
            {group.tokens.map((token) => (
              <ColorSwatch key={token.id} token={token} />
            ))}
          </div>
        </section>
      ))}
    </DesignSystemPageShell>
  )
}
