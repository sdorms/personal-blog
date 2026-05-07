import Icon from '@/components/ui/Icon'

type SignalPillVariant = 'positive' | 'negative'

type SignalPillProps = {
  label: string
  variant: SignalPillVariant
}

const variantStyles: Record<SignalPillVariant, string> = {
  positive: 'border-success-border text-success',
  negative: 'border-danger-border text-danger',
}

const variantIcon: Record<SignalPillVariant, 'checkCircle' | 'warning'> = {
  positive: 'checkCircle',
  negative: 'warning',
}

export default function SignalPill({ label, variant }: SignalPillProps) {
  return (
    <span
      className={`text-button inline-flex items-center gap-1 rounded border px-2 py-2 ${variantStyles[variant]}`}
    >
      <Icon name={variantIcon[variant]} size="small" />
      <span>{label}</span>
    </span>
  )
}
