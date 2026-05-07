import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text' | 'text-back'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

const CONTAINED_BASE_CLASSNAME =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const TEXT_BASE_CLASSNAME =
  'inline-flex items-center gap-2 px-0 py-0 text-link transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const VARIANT_CLASSNAMES: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-panel text-heading hover:bg-subtle',
  ghost: 'bg-transparent text-body hover:bg-panel',
  danger: 'bg-danger text-white hover:bg-danger-hover',
  text: 'bg-transparent text-accent hover:text-primary-600',
  'text-back': 'bg-transparent text-accent hover:text-primary-600',
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function Button({
  variant = 'primary',
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  const isTextVariant = variant === 'text' || variant === 'text-back'

  return (
    <button
      type={type}
      className={cx(
        isTextVariant ? TEXT_BASE_CLASSNAME : CONTAINED_BASE_CLASSNAME,
        VARIANT_CLASSNAMES[variant],
        className
      )}
      {...props}
    >
      {variant === 'text-back' ? <span aria-hidden="true">←</span> : null}
      {children}
      {variant === 'text' ? <span aria-hidden="true">→</span> : null}
    </button>
  )
}
