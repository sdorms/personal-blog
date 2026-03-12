export type EffectCategory = 'radius' | 'border' | 'shadow' | 'surface'
export type EffectSource = 'existing' | 'normalized' | 'new'

export type EffectToken = {
  id: string
  name: string
  category: EffectCategory
  className: string
  usage: string
  source: EffectSource
}

export const EFFECT_TOKENS: EffectToken[] = [
  {
    id: 'radius-card',
    name: 'Card Radius',
    category: 'radius',
    className: 'rounded-2xl',
    usage: 'Approved default radius for cards, panels, and larger surfaced containers',
    source: 'normalized',
  },
  {
    id: 'radius-control',
    name: 'Control Radius',
    category: 'radius',
    className: 'rounded-xl',
    usage: 'Approved default radius for inputs, buttons, and compact controls',
    source: 'normalized',
  },
  {
    id: 'border-default',
    name: 'Default Border',
    category: 'border',
    className: 'border border-gray-200 dark:border-gray-800',
    usage: 'Default border treatment for cards, inputs, and standard containers',
    source: 'existing',
  },
  {
    id: 'shadow-default',
    name: 'Default Shadow',
    category: 'shadow',
    className: 'shadow-sm',
    usage: 'Approved default shadow for surfaced UI elements',
    source: 'existing',
  },
  {
    id: 'surface-card',
    name: 'Card Surface',
    category: 'surface',
    className: 'bg-white dark:bg-gray-950',
    usage: 'Default surface for cards and tool containers',
    source: 'existing',
  },
  {
    id: 'surface-panel',
    name: 'Panel Surface',
    category: 'surface',
    className: 'bg-gray-50 dark:bg-gray-900',
    usage: 'Grouped panels and subtle nested surfaces',
    source: 'normalized',
  },
]
