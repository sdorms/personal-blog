import type { Metadata } from 'next'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import IconSpecimen from '@/components/design-system/IconSpecimen'

export const metadata: Metadata = {
  title: 'Design System - Icons',
  description: 'Icons used on the site and tooling.',
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="icons">
      <IconSpecimen />
    </DesignSystemPageShell>
  )
}
