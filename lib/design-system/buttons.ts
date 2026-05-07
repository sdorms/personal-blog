import type { ButtonVariant } from '@/components/ui/Button'

export type ButtonSource = 'existing' | 'normalized' | 'new'

export type ButtonToken = {
  id: ButtonVariant
  name: 'Primary' | 'Secondary' | 'Ghost' | 'Danger' | 'Text' | 'Text Back'
  usage: string
  className: string
  source: ButtonSource
  isTextStyle?: boolean
}

export const BUTTON_SHARED_CLASSNAME =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent'

export const BUTTON_TEXT_SHARED_CLASSNAME =
  'inline-flex items-center gap-2 px-0 py-0 text-link transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent'

export const BUTTON_TOKENS: ButtonToken[] = [
  {
    id: 'primary',
    name: 'Primary',
    usage: 'Primary call-to-action',
    className: 'bg-primary-500 text-white hover:bg-primary-600',
    source: 'normalized',
  },
  {
    id: 'secondary',
    name: 'Secondary',
    usage: 'Secondary or subtle action',
    className: 'bg-panel text-heading hover:bg-subtle',
    source: 'normalized',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    usage: 'Low-emphasis contextual action',
    className: 'bg-transparent text-body hover:bg-panel',
    source: 'normalized',
  },
  {
    id: 'danger',
    name: 'Danger',
    usage: 'Destructive or risky action',
    className: 'bg-danger text-white hover:bg-danger-hover',
    source: 'normalized',
  },
  {
    id: 'text',
    name: 'Text',
    usage: 'Standalone text-only call-to-action',
    className: 'bg-transparent text-accent hover:text-primary-600',
    source: 'normalized',
    isTextStyle: true,
  },
  {
    id: 'text-back',
    name: 'Text Back',
    usage: 'Backward navigation or return action',
    className: 'bg-transparent text-accent hover:text-primary-600',
    source: 'normalized',
    isTextStyle: true,
  },
]
