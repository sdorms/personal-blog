'use client'

import { useState } from 'react'
import RadioGroup, { RadioOption } from '@/components/ui/RadioGroup'

type DemoOption = {
  value: string
  label: string
  helper?: string
  disabled?: boolean
}

type RadioGroupDemoProps = {
  label?: string
  helper?: string
  error?: string
  name: string
  initialValue?: string
  required?: boolean
  disabled?: boolean
  options: DemoOption[]
}

export default function RadioGroupDemo({
  label,
  helper,
  error,
  name,
  initialValue,
  required = false,
  disabled = false,
  options,
}: RadioGroupDemoProps) {
  const [value, setValue] = useState(initialValue ?? '')

  return (
    <RadioGroup
      label={label}
      helper={helper}
      error={error}
      name={name}
      value={value}
      onValueChange={setValue}
      required={required}
      disabled={disabled}
    >
      {options.map((option) => (
        <RadioOption
          key={option.value}
          value={option.value}
          label={option.label}
          helper={option.helper}
          disabled={option.disabled}
        />
      ))}
    </RadioGroup>
  )
}
