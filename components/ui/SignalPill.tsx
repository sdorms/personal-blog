import Icon from '@/components/ui/Icon'

type SignalPillVariant = 'positive' | 'negative'

type SignalPillProps = {
  label: string
  variant: SignalPillVariant
  as?: 'span' | 'button'
  className?: string
  onClick?: () => void
  'aria-label'?: string
}

const variantStyles: Record<SignalPillVariant, string> = {
  positive: 'border-success-border text-success',
  negative: 'border-danger-border text-danger',
}

const variantIcon: Record<SignalPillVariant, 'checkCircle' | 'warning'> = {
  positive: 'checkCircle',
  negative: 'warning',
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function SignalPill({
  label,
  variant,
  as = 'span',
  className,
  onClick,
  'aria-label': ariaLabel,
}: SignalPillProps) {
  const pillClassName = cx(
    'text-button inline-flex items-center gap-1 rounded border px-2 py-2',
    variantStyles[variant],
    className
  )

  if (as === 'button') {
    return (
      <button type="button" aria-label={ariaLabel} className={pillClassName} onClick={onClick}>
        <Icon name={variantIcon[variant]} size="small" />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <span className={pillClassName}>
      <Icon name={variantIcon[variant]} size="small" />
      <span>{label}</span>
    </span>
  )
}
