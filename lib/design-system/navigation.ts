export type DesignSystemSectionId =
  | 'typography'
  | 'colors'
  | 'spacing'
  | 'effects'
  | 'buttons'
  | 'cards'
  | 'fields'
  | 'icons'

export type DesignSystemSection = {
  id: DesignSystemSectionId
  title: string
  href: `/design-system/${DesignSystemSectionId}`
  description: string
}

export const DESIGN_SYSTEM_SECTIONS: DesignSystemSection[] = [
  {
    id: 'typography',
    title: 'Typography',
    href: '/design-system/typography',
    description: 'Type scale, family usage, and specimen previews.',
  },
  {
    id: 'colors',
    title: 'Colors',
    href: '/design-system/colors',
    description: 'Palette scales, semantic colors, text, surfaces, and borders.',
  },
  {
    id: 'spacing',
    title: 'Spacing',
    href: '/design-system/spacing',
    description: 'Approved spacing scale and practical usage patterns.',
  },
  {
    id: 'effects',
    title: 'Surfaces & Effects',
    href: '/design-system/effects',
    description: 'Radius, border, shadow, and surface defaults.',
  },
  {
    id: 'buttons',
    title: 'Buttons',
    href: '/design-system/buttons',
    description: 'Button variants and state previews for core actions.',
  },
  {
    id: 'cards',
    title: 'Cards',
    href: '/design-system/cards',
    description: 'Container surfaces for grouped UI content and panels.',
  },
  {
    id: 'fields',
    title: 'Fields',
    href: '/design-system/fields',
    description: 'Input controls including text inputs, numeric fields, and choice selectors.',
  },
  {
    id: 'icons',
    title: 'Icons',
    href: '/design-system/icons',
    description: 'Phosphor library usage, size tokens, and semantic mappings.',
  },
]

export function getSectionById(id: DesignSystemSectionId): DesignSystemSection {
  const section = DESIGN_SYSTEM_SECTIONS.find((item) => item.id === id)
  if (!section) {
    throw new Error(`Unknown design-system section: ${id}`)
  }
  return section
}

export function getSectionNeighbors(id: DesignSystemSectionId) {
  const index = DESIGN_SYSTEM_SECTIONS.findIndex((section) => section.id === id)
  if (index === -1) {
    throw new Error(`Unknown design-system section: ${id}`)
  }

  return {
    previous: index > 0 ? DESIGN_SYSTEM_SECTIONS[index - 1] : null,
    next: index < DESIGN_SYSTEM_SECTIONS.length - 1 ? DESIGN_SYSTEM_SECTIONS[index + 1] : null,
  }
}
