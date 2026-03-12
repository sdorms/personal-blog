export type ColorCategory = 'palette' | 'semantic' | 'text' | 'surface' | 'border' | 'button'

export type ColorSource = 'existing' | 'normalized' | 'new'

export type PaletteSwatch = {
  id: string
  name: string
  className: string
}

export type PaletteScale = {
  id: string
  title: string
  usage: string
  swatches: PaletteSwatch[]
}

export type ColorToken = {
  id: string
  name: string
  category: Exclude<ColorCategory, 'palette'>
  className: string
  usage: string
  source: ColorSource
}

export type ColorTokenGroup = {
  id: Exclude<ColorCategory, 'palette'>
  title: string
  description: string
  tokens: ColorToken[]
}

export const COLOR_PALETTE_SCALES: PaletteScale[] = [
  {
    id: 'primary',
    title: 'Primary Scale',
    usage: 'Brand accent, links, highlights, buttons',
    swatches: [
      { id: 'primary-50', name: 'primary-50', className: 'bg-primary-50' },
      { id: 'primary-100', name: 'primary-100', className: 'bg-primary-100' },
      { id: 'primary-200', name: 'primary-200', className: 'bg-primary-200' },
      { id: 'primary-300', name: 'primary-300', className: 'bg-primary-300' },
      { id: 'primary-400', name: 'primary-400', className: 'bg-primary-400' },
      { id: 'primary-500', name: 'primary-500', className: 'bg-primary-500' },
      { id: 'primary-600', name: 'primary-600', className: 'bg-primary-600' },
      { id: 'primary-700', name: 'primary-700', className: 'bg-primary-700' },
      { id: 'primary-800', name: 'primary-800', className: 'bg-primary-800' },
      { id: 'primary-900', name: 'primary-900', className: 'bg-primary-900' },
    ],
  },
  {
    id: 'neutral',
    title: 'Neutral Scale',
    usage: 'Core surfaces, borders, text hierarchy, muted UI',
    swatches: [
      { id: 'gray-50', name: 'gray-50', className: 'bg-gray-50 dark:bg-gray-50' },
      { id: 'gray-100', name: 'gray-100', className: 'bg-gray-100 dark:bg-gray-100' },
      { id: 'gray-200', name: 'gray-200', className: 'bg-gray-200 dark:bg-gray-200' },
      { id: 'gray-300', name: 'gray-300', className: 'bg-gray-300 dark:bg-gray-300' },
      { id: 'gray-400', name: 'gray-400', className: 'bg-gray-400 dark:bg-gray-400' },
      { id: 'gray-500', name: 'gray-500', className: 'bg-gray-500 dark:bg-gray-500' },
      { id: 'gray-600', name: 'gray-600', className: 'bg-gray-600 dark:bg-gray-600' },
      { id: 'gray-700', name: 'gray-700', className: 'bg-gray-700 dark:bg-gray-700' },
      { id: 'gray-800', name: 'gray-800', className: 'bg-gray-800 dark:bg-gray-800' },
      { id: 'gray-900', name: 'gray-900', className: 'bg-gray-900 dark:bg-gray-900' },
      { id: 'gray-950', name: 'gray-950', className: 'bg-gray-950 dark:bg-gray-950' },
    ],
  },
]

export const COLOR_TOKEN_GROUPS: ColorTokenGroup[] = [
  {
    id: 'semantic',
    title: 'Semantic States',
    description: 'Status-oriented colors used for opportunity quality and validation states.',
    tokens: [
      {
        id: 'success',
        category: 'semantic',
        name: 'Success',
        className:
          'text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950/40 dark:border-green-800',
        usage: 'Positive signals, validated states, strong opportunities',
        source: 'normalized',
      },
      {
        id: 'warning',
        category: 'semantic',
        name: 'Warning / Emerging',
        className:
          'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800',
        usage: 'Emerging opportunities, partial validation, caution states',
        source: 'normalized',
      },
      {
        id: 'danger',
        category: 'semantic',
        name: 'Danger',
        className:
          'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/40 dark:border-red-800',
        usage: 'Weak signals, destructive actions, validation errors',
        source: 'normalized',
      },
    ],
  },
  {
    id: 'text',
    title: 'Text Colors',
    description: 'Text hierarchy and contrast styles for content and product interfaces.',
    tokens: [
      {
        id: 'text-heading',
        category: 'text',
        name: 'Heading Text',
        className: 'text-gray-900 dark:text-gray-100',
        usage: 'Headings and high-emphasis text',
        source: 'existing',
      },
      {
        id: 'text-body',
        category: 'text',
        name: 'Body Text',
        className: 'text-gray-700 dark:text-gray-200',
        usage: 'Default paragraph and interface copy',
        source: 'normalized',
      },
      {
        id: 'text-muted',
        category: 'text',
        name: 'Muted Text',
        className: 'text-gray-500 dark:text-gray-400',
        usage: 'Metadata, helper text, captions',
        source: 'existing',
      },
      {
        id: 'text-accent',
        category: 'text',
        name: 'Accent Text',
        className: 'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400',
        usage: 'Links and accent emphasis',
        source: 'existing',
      },
      {
        id: 'text-inverse',
        category: 'text',
        name: 'Inverse Text',
        className: 'text-white',
        usage: 'Text on dark or primary-colored backgrounds',
        source: 'normalized',
      },
    ],
  },
  {
    id: 'surface',
    title: 'Surface Colors',
    description: 'Background treatments for layout, cards, and nested panels.',
    tokens: [
      {
        id: 'surface-page',
        category: 'surface',
        name: 'Page Background',
        className: 'bg-white dark:bg-gray-950',
        usage: 'Default app/page background',
        source: 'existing',
      },
      {
        id: 'surface-card',
        category: 'surface',
        name: 'Card Surface',
        className: 'bg-white dark:bg-gray-950',
        usage: 'Cards, panels, tool containers',
        source: 'existing',
      },
      {
        id: 'surface-panel',
        category: 'surface',
        name: 'Panel Surface',
        className: 'bg-gray-50 dark:bg-gray-900',
        usage: 'Grouped panels and subtle nested sections',
        source: 'normalized',
      },
      {
        id: 'surface-subtle',
        category: 'surface',
        name: 'Subtle Highlight',
        className: 'bg-gray-100 dark:bg-gray-900',
        usage: 'Hover states and low-emphasis highlights',
        source: 'normalized',
      },
    ],
  },
  {
    id: 'border',
    title: 'Border Colors',
    description: 'Border styles for structure, separation, and visual rhythm.',
    tokens: [
      {
        id: 'border-default',
        category: 'border',
        name: 'Default Border',
        className: 'border-gray-200 dark:border-gray-800',
        usage: 'Cards, inputs, panels, standard containers',
        source: 'existing',
      },
      {
        id: 'border-divider',
        category: 'border',
        name: 'Divider Border',
        className: 'border-gray-100 dark:border-gray-700',
        usage: 'Subtle separators and internal dividers',
        source: 'normalized',
      },
    ],
  },
  {
    id: 'button',
    title: 'Buttons',
    description: 'Default action styles for primary and secondary user actions.',
    tokens: [
      {
        id: 'button-primary',
        category: 'button',
        name: 'Primary Button',
        className:
          'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500',
        usage: 'Primary call-to-action buttons',
        source: 'normalized',
      },
      {
        id: 'button-secondary',
        category: 'button',
        name: 'Secondary Button',
        className:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
        usage: 'Secondary or low-emphasis actions',
        source: 'normalized',
      },
    ],
  },
]
