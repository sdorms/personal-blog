import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  CaretDown as CaretDownIcon,
  CaretRight as CaretRightIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Copy as CopyIcon,
  EnvelopeSimple as EmailIcon,
  ExternalLink as ExternalIcon,
  FloppyDisk as SaveIcon,
  Gear as SettingsIcon,
  GithubLogo as GithubIcon,
  Info as InfoIcon,
  LinkedinLogo as LinkedinIcon,
  MagnifyingGlass as SearchIcon,
  PencilSimple as EditIcon,
  Plus as PlusIcon,
  Share as ShareIcon,
  ShareNetwork as ShareNetworkIcon,
  Trash as TrashIcon,
  User as UserIcon,
  WarningCircle as WarningIcon,
  X as CloseIcon,
  XCircle as XCircleIcon,
  type Icon as PhosphorIcon,
  type IconProps as PhosphorIconProps,
} from '@phosphor-icons/react'

export const Icons = {
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  caretRight: CaretRightIcon,
  caretDown: CaretDownIcon,
  close: CloseIcon,
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  xCircle: XCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
  plus: PlusIcon,
  edit: EditIcon,
  trash: TrashIcon,
  save: SaveIcon,
  copy: CopyIcon,
  share: ShareIcon,
  shareNetwork: ShareNetworkIcon,
  external: ExternalIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  user: UserIcon,
  email: EmailIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
} as const satisfies Record<string, PhosphorIcon>

export type IconName = keyof typeof Icons
export type IconSize = 'small' | 'default' | 'large'

const ICON_SIZE_CLASSNAMES: Record<IconSize, string> = {
  small: 'h-4 w-4',
  default: 'h-5 w-5',
  large: 'h-6 w-6',
}

type IconProps = Omit<PhosphorIconProps, 'size'> & {
  name: IconName
  size?: IconSize
  className?: string
  decorative?: boolean
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function Icon({
  name,
  size = 'default',
  className,
  decorative = true,
  'aria-hidden': ariaHidden,
  ...props
}: IconProps) {
  const Component = Icons[name]

  return (
    <Component
      aria-hidden={decorative ? true : ariaHidden}
      className={cx(ICON_SIZE_CLASSNAMES[size], className)}
      {...props}
    />
  )
}
