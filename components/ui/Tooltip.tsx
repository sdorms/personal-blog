'use client'

import { useId, useRef, useState } from 'react'

type TooltipProps = {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom'
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const id = useId()

  // --- Hover (with delay)
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setOpen(true), 200)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  // --- Focus (instant)
  const handleFocus = () => setOpen(true)
  const handleBlur = () => setOpen(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-describedby={open ? id : undefined}
    >
      {children}

      {open && (
        <div
          id={id}
          role="tooltip"
          className={`tooltip tooltip-${position} tooltip-anim tooltip-anim-open`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
