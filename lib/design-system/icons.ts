export type IconSource = 'existing' | 'normalized' | 'new'

export type IconSizeToken = {
  id: string
  name: string
  className: string
  usage: string
  source: IconSource
}

export type SemanticIconToken = {
  id: string
  name: string
  iconName: 'checkCircle' | 'warning' | 'xCircle' | 'info'
  usage: string
  source: 'normalized' | 'new'
}

export const ICON_LIBRARY = {
  name: 'Phosphor React',
  packageName: '@phosphor-icons/react',
} as const

export const ICON_SAMPLE_ROW: Array<SemanticIconToken['iconName']> = [
  'checkCircle',
  'warning',
  'xCircle',
  'info',
]

export const ICON_SIZE_TOKENS: IconSizeToken[] = [
  {
    id: 'icon-small',
    name: 'Small',
    className: 'h-4 w-4',
    usage: 'Inline metadata, compact labels, and dense UI',
    source: 'normalized',
  },
  {
    id: 'icon-default',
    name: 'Default',
    className: 'h-5 w-5',
    usage: 'Standard UI icon size',
    source: 'normalized',
  },
  {
    id: 'icon-large',
    name: 'Large',
    className: 'h-6 w-6',
    usage: 'Feature, status, and emphasis icons',
    source: 'normalized',
  },
]

export const SEMANTIC_ICON_TOKENS: SemanticIconToken[] = [
  {
    id: 'icon-success',
    name: 'Success',
    iconName: 'checkCircle',
    usage: 'Positive signals, validated states, success feedback',
    source: 'normalized',
  },
  {
    id: 'icon-warning',
    name: 'Warning',
    iconName: 'warning',
    usage: 'Emerging opportunities, caution states, partial validation',
    source: 'normalized',
  },
  {
    id: 'icon-danger',
    name: 'Danger',
    iconName: 'xCircle',
    usage: 'Weak signals, destructive actions, error states',
    source: 'normalized',
  },
  {
    id: 'icon-info',
    name: 'Info',
    iconName: 'info',
    usage: 'Informational context and neutral guidance',
    source: 'normalized',
  },
]
