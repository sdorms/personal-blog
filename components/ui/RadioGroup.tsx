'use client'

import { createContext, useContext, useId, type ReactNode, type InputHTMLAttributes } from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function toDomSafeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '')
}

type RadioGroupContextValue = {
  name: string
  value?: string
  onValueChange?: (value: string) => void
  describedBy?: string
  invalid: boolean
  disabled: boolean
  required: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error('RadioOption must be used within a RadioGroup.')
  }

  return context
}

export type RadioGroupProps = {
  label?: ReactNode
  helper?: ReactNode
  error?: ReactNode
  name?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  required?: boolean
  disabled?: boolean
  className?: string
}

export default function RadioGroup({
  label,
  helper,
  error,
  name,
  value,
  onValueChange,
  children,
  required = false,
  disabled = false,
  className,
}: RadioGroupProps) {
  const reactId = useId()
  const safeId = toDomSafeId(reactId)
  const groupName = name ?? `radio-group-${safeId}`
  const helperId = helper ? `${groupName}-helper` : undefined
  const errorId = error ? `${groupName}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined
  const invalid = Boolean(error)

  return (
    <fieldset
      className={cx('radio-group', className)}
      disabled={disabled}
      aria-invalid={invalid || undefined}
    >
      {label ? (
        <div className="radio-group-header">
          <legend className="radio-group-label">{label}</legend>
          {helper ? (
            <span id={helperId} className="radio-group-helper">
              {helper}
            </span>
          ) : null}
        </div>
      ) : helper ? (
        <div className="radio-group-header">
          <p id={helperId} className="radio-group-helper">
            {helper}
          </p>
        </div>
      ) : null}

      <RadioGroupContext.Provider
        value={{
          name: groupName,
          value,
          onValueChange,
          describedBy,
          invalid,
          disabled,
          required,
        }}
      >
        <div className="radio-options">{children}</div>
      </RadioGroupContext.Provider>

      {error ? (
        <p id={errorId} className="radio-group-error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

type NativeRadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'value' | 'checked' | 'onChange' | 'disabled'
>

export type RadioOptionProps = NativeRadioProps & {
  value: string
  label: ReactNode
  helper?: ReactNode
  disabled?: boolean
  className?: string
}

export function RadioOption({
  value,
  label,
  helper,
  disabled = false,
  className,
  id,
  ...inputProps
}: RadioOptionProps) {
  const group = useRadioGroupContext()
  const reactId = useId()
  const safeId = toDomSafeId(reactId)
  const inputId = id ?? `${group.name}-${toDomSafeId(value)}-${safeId}`
  const helperId = helper ? `${inputId}-helper` : undefined
  const describedBy = [group.describedBy, helperId].filter(Boolean).join(' ') || undefined
  const isChecked = group.value === value
  const isDisabled = group.disabled || disabled

  return (
    <label
      className={cx('radio-option', group.invalid && 'radio-option-error', className)}
      htmlFor={inputId}
    >
      <input
        {...inputProps}
        id={inputId}
        className="radio-option-input"
        type="radio"
        name={group.name}
        value={value}
        checked={isChecked}
        onChange={() => group.onValueChange?.(value)}
        aria-describedby={describedBy}
        disabled={isDisabled}
        required={group.required}
      />
      <span className="radio-option-control" aria-hidden="true">
        <span className="radio-option-indicator" />
      </span>
      <span className="radio-option-content">
        <span className="radio-option-label">{label}</span>
        {helper ? (
          <span id={helperId} className="radio-option-helper">
            {helper}
          </span>
        ) : null}
      </span>
    </label>
  )
}
