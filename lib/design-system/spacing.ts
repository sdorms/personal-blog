export type SpacingSource = 'existing' | 'normalized' | 'new'

export type SpacingScaleToken = {
  id: string
  name: string
  category: 'scale'
  tailwind: string
  px: number
  rem: string
  usage: string
  source: SpacingSource
}

export type SpacingUsageToken = {
  id: string
  name: string
  category: 'usage'
  tailwind: string
  px: string
  rem: string
  usage: string
  source: SpacingSource
}

export const SPACING_SCALE_TOKENS: SpacingScaleToken[] = [
  {
    id: 'space-1',
    name: 'space-1',
    category: 'scale',
    tailwind: '1',
    px: 4,
    rem: '0.25rem',
    usage: 'Tiny adjustments and very tight spacing',
    source: 'existing',
  },
  {
    id: 'space-2',
    name: 'space-2',
    category: 'scale',
    tailwind: '2',
    px: 8,
    rem: '0.5rem',
    usage: 'Icon/text gaps and tight inline spacing',
    source: 'existing',
  },
  {
    id: 'space-3',
    name: 'space-3',
    category: 'scale',
    tailwind: '3',
    px: 12,
    rem: '0.75rem',
    usage: 'Compact UI spacing and small vertical gaps',
    source: 'existing',
  },
  {
    id: 'space-4',
    name: 'space-4',
    category: 'scale',
    tailwind: '4',
    px: 16,
    rem: '1rem',
    usage: 'Small component padding and standard inline spacing',
    source: 'existing',
  },
  {
    id: 'space-5',
    name: 'space-5',
    category: 'scale',
    tailwind: '5',
    px: 20,
    rem: '1.25rem',
    usage: 'Legacy/default card padding in current UI',
    source: 'existing',
  },
  {
    id: 'space-6',
    name: 'space-6',
    category: 'scale',
    tailwind: '6',
    px: 24,
    rem: '1.5rem',
    usage: 'Preferred default card padding, section spacing, and grid gaps',
    source: 'normalized',
  },
  {
    id: 'space-8',
    name: 'space-8',
    category: 'scale',
    tailwind: '8',
    px: 32,
    rem: '2rem',
    usage: 'Larger internal section spacing',
    source: 'existing',
  },
  {
    id: 'space-10',
    name: 'space-10',
    category: 'scale',
    tailwind: '10',
    px: 40,
    rem: '2.5rem',
    usage: 'Page-level vertical spacing and major section separation',
    source: 'existing',
  },
  {
    id: 'space-12',
    name: 'space-12',
    category: 'scale',
    tailwind: '12',
    px: 48,
    rem: '3rem',
    usage: 'Large layout separation',
    source: 'new',
  },
  {
    id: 'space-16',
    name: 'space-16',
    category: 'scale',
    tailwind: '16',
    px: 64,
    rem: '4rem',
    usage: 'Major page block spacing',
    source: 'new',
  },
]

export const SPACING_USAGE_TOKENS: SpacingUsageToken[] = [
  {
    id: 'usage-card-padding',
    name: 'Card Padding',
    category: 'usage',
    tailwind: 'p-6',
    px: '24',
    rem: '1.5rem',
    usage: 'Preferred default card padding for new UI',
    source: 'normalized',
  },
  {
    id: 'usage-card-padding-compact',
    name: 'Compact Card Padding',
    category: 'usage',
    tailwind: 'p-5',
    px: '20',
    rem: '1.25rem',
    usage: 'Use where density matters or to match existing UI',
    source: 'existing',
  },
  {
    id: 'usage-section-stack',
    name: 'Section Stack',
    category: 'usage',
    tailwind: 'space-y-6',
    px: '24',
    rem: '1.5rem',
    usage: 'Default vertical rhythm between grouped content blocks',
    source: 'normalized',
  },
  {
    id: 'usage-compact-stack',
    name: 'Compact Stack',
    category: 'usage',
    tailwind: 'space-y-4',
    px: '16',
    rem: '1rem',
    usage: 'Tighter vertical grouping for denser cards and controls',
    source: 'existing',
  },
  {
    id: 'usage-grid-gap',
    name: 'Grid Gap',
    category: 'usage',
    tailwind: 'gap-6',
    px: '24',
    rem: '1.5rem',
    usage: 'Default gap between cards and two-column layout blocks',
    source: 'existing',
  },
  {
    id: 'usage-grid-gap-compact',
    name: 'Compact Grid Gap',
    category: 'usage',
    tailwind: 'gap-3',
    px: '12',
    rem: '0.75rem',
    usage: 'Smaller metric grids and tighter multi-column content',
    source: 'existing',
  },
  {
    id: 'usage-page-padding',
    name: 'Page Padding',
    category: 'usage',
    tailwind: 'px-4 py-10',
    px: '16 / 40',
    rem: '1rem / 2.5rem',
    usage: 'Standard internal-tool page padding',
    source: 'existing',
  },
  {
    id: 'usage-inline-control',
    name: 'Inline Control Padding',
    category: 'usage',
    tailwind: 'px-3 py-2',
    px: '12 / 8',
    rem: '0.75rem / 0.5rem',
    usage: 'Buttons, segmented controls, and compact interactive elements',
    source: 'existing',
  },
]
