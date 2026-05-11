'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import Icon from '@/components/ui/Icon'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
  ariaLabel?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function isPlainTextContent(content: ReactNode) {
  if (content == null || typeof content === 'boolean') {
    return false
  }

  if (typeof content === 'string' || typeof content === 'number') {
    return true
  }

  if (Array.isArray(content)) {
    return content.every((item) => isPlainTextContent(item))
  }

  return false
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  ariaLabel,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusedElementRef = useRef<HTMLElement | null>(null)
  const previousBodyOverflowRef = useRef<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    previousBodyOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTarget = closeButtonRef.current ?? dialogRef.current
    focusTarget?.focus()

    return () => {
      document.body.style.overflow = previousBodyOverflowRef.current ?? ''
      previousFocusedElementRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeOnEscape, onClose, open])

  if (!open) {
    return null
  }

  const hasTitle = title != null
  const shouldUsePlainTextBodyStyles = isPlainTextContent(children)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {closeOnOverlayClick ? (
        <button
          type="button"
          aria-label="Close modal"
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
      )}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-label={hasTitle ? undefined : ariaLabel}
        tabIndex={-1}
        className={cx(
          'bg-card border-border relative z-10 w-full max-w-2xl rounded-2xl border p-6 shadow-sm',
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {hasTitle ? (
            <h2 id={titleId} className="text-h4 text-heading pr-3">
              {title}
            </h2>
          ) : (
            <div />
          )}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-body focus-visible:outline-accent inline-flex cursor-pointer rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Icon name="close" size="default" />
          </button>
        </div>

        {children != null ? (
          <div
            className={cx(
              'mt-6',
              shouldUsePlainTextBodyStyles && 'text-body-md text-body space-y-3'
            )}
          >
            {children}
          </div>
        ) : null}

        {footer ? <div className="mt-8 flex flex-wrap items-center gap-2">{footer}</div> : null}
      </div>
    </div>
  )
}
