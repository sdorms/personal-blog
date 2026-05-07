import type { Metadata } from 'next'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'
import TypographySpecimen from '@/components/design-system/TypographySpecimen'
import { TEXT_STYLE_SECTIONS } from '@/lib/design-system/textStyles'

export const metadata: Metadata = {
  title: 'Design System - Typography',
  description: 'Typography scale and specimen reference.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="typography">
      {TEXT_STYLE_SECTIONS.map((section) => (
        <section key={section.id} className="space-y-4">
          <DesignSystemSectionHeader title={section.title} description={section.description} />

          <div className="grid gap-4">
            {section.tokens.map((token) => (
              <TypographySpecimen key={token.id} token={token} />
            ))}
          </div>
        </section>
      ))}
    </DesignSystemPageShell>
  )
}
