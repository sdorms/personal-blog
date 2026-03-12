export type ButtonSource = 'existing' | 'normalized' | 'new'

export type ButtonToken = {
  id: 'primary' | 'secondary' | 'ghost' | 'text-link' | 'destructive'
  name: 'Primary' | 'Secondary' | 'Ghost' | 'Text Link' | 'Destructive'
  usage: string
  className: string
  source: ButtonSource
  isLinkStyle?: boolean
}

export const BUTTON_SHARED_CLASSNAME =
  'rounded-xl px-3 py-2 text-sm font-medium inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

export const BUTTON_TOKENS: ButtonToken[] = [
  {
    id: 'primary',
    name: 'Primary',
    usage: 'Primary call-to-action',
    className:
      'bg-primary-500 text-white hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
    source: 'normalized',
  },
  {
    id: 'secondary',
    name: 'Secondary',
    usage: 'Secondary or subtle action',
    className:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed',
    source: 'normalized',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    usage: 'Low-emphasis contextual action',
    className:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary-500 dark:text-gray-200 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
    source: 'normalized',
  },
  {
    id: 'text-link',
    name: 'Text Link',
    usage: 'Tertiary or navigational action',
    className:
      'bg-transparent px-0 py-0 text-primary-500 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-500 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed',
    source: 'normalized',
    isLinkStyle: true,
  },
  {
    id: 'destructive',
    name: 'Destructive',
    usage: 'Destructive or risky action',
    className:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed',
    source: 'normalized',
  },
]
