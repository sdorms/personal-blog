'use client'

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === 'function') {
        ref(node)
        return
      }

      ref.current = node
    })
  }
}

function composeEventHandlers<Event extends { defaultPrevented?: boolean }>(
  externalHandler: ((event: Event) => void) | undefined,
  internalHandler: (event: Event) => void
) {
  return (event: Event) => {
    externalHandler?.(event)

    if (!event.defaultPrevented) {
      internalHandler(event)
    }
  }
}

const MENU_ITEM_SELECTOR = '[data-popover-item="true"]:not([aria-disabled="true"])'
type MenuItemFocusIntent = 'first' | 'last'

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  close: (options?: { returnFocus?: boolean }) => void
  requestMenuItemFocus: (intent: MenuItemFocusIntent) => void
  focusPendingMenuItem: () => void
  triggerId: string
  contentId: string
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext(componentName: string) {
  const context = useContext(PopoverContext)

  if (!context) {
    throw new Error(`${componentName} must be used within a Popover.`)
  }

  return context
}

export type PopoverProps = {
  children: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Popover({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: PopoverProps) {
  const triggerId = useId()
  const contentId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const pendingFocusIntentRef = useRef<MenuItemFocusIntent | null>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  const close = useCallback(
    (options: { returnFocus?: boolean } = {}) => {
      setOpen(false)

      if (options.returnFocus !== false) {
        window.requestAnimationFrame(() => {
          triggerRef.current?.focus()
        })
      }
    },
    [setOpen]
  )

  const focusPendingMenuItem = useCallback(() => {
    const intent = pendingFocusIntentRef.current

    if (!intent) {
      return
    }

    window.requestAnimationFrame(() => {
      const content = contentRef.current

      if (!content) {
        return
      }

      const items = Array.from(content.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
      const target = intent === 'first' ? items[0] : items[items.length - 1]

      if (pendingFocusIntentRef.current !== intent) {
        return
      }

      pendingFocusIntentRef.current = null
      ;(target ?? content).focus()
    })
  }, [])

  const requestMenuItemFocus = useCallback(
    (intent: MenuItemFocusIntent) => {
      pendingFocusIntentRef.current = intent
      focusPendingMenuItem()
    },
    [focusPendingMenuItem]
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) {
        return
      }

      close()
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, isOpen])

  return (
    <PopoverContext.Provider
      value={{
        open: isOpen,
        setOpen,
        close,
        requestMenuItemFocus,
        focusPendingMenuItem,
        triggerId,
        contentId,
        triggerRef,
        contentRef,
      }}
    >
      <div className={cx('relative inline-flex', className)}>{children}</div>
    </PopoverContext.Provider>
  )
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void
  id?: string
  'aria-haspopup'?: 'menu'
  'aria-expanded'?: boolean
  'aria-controls'?: string
}

export type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode
  asChild?: boolean
}

export function PopoverTrigger({
  children,
  asChild = false,
  className,
  onClick,
  onKeyDown,
  type = 'button',
  ...props
}: PopoverTriggerProps) {
  const { open, setOpen, requestMenuItemFocus, triggerId, contentId, triggerRef } =
    usePopoverContext('PopoverTrigger')

  function handleClick() {
    setOpen(!open)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      requestMenuItemFocus('first')
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      requestMenuItemFocus('last')
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(!open)

      if (!open) {
        requestMenuItemFocus('first')
      }
    }
  }

  const triggerProps = {
    id: props.id ?? triggerId,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    onClick: composeEventHandlers(
      onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined,
      handleClick
    ),
    onKeyDown: composeEventHandlers(
      onKeyDown as ((event: KeyboardEvent<HTMLElement>) => void) | undefined,
      handleKeyDown
    ),
  }

  if (asChild) {
    const child = Children.only(children)

    if (!isValidElement<TriggerChildProps>(child)) {
      throw new Error('PopoverTrigger with asChild expects a single valid React element.')
    }

    return cloneElement(child, {
      ...triggerProps,
      onClick: composeEventHandlers(child.props.onClick, triggerProps.onClick),
      onKeyDown: composeEventHandlers(child.props.onKeyDown, triggerProps.onKeyDown),
      ref: mergeRefs(triggerRef, child.props.ref),
    })
  }

  return (
    <button
      {...props}
      {...triggerProps}
      ref={triggerRef as React.RefObject<HTMLButtonElement | null>}
      type={type}
      className={className}
    >
      {children}
    </button>
  )
}

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'end'
}

export function PopoverContent({
  children,
  align = 'start',
  className,
  onKeyDown,
  ...props
}: PopoverContentProps) {
  const { open, contentId, triggerId, contentRef, focusPendingMenuItem } =
    usePopoverContext('PopoverContent')

  const getEnabledItems = useCallback(() => {
    return Array.from(contentRef.current?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? [])
  }, [contentRef])

  useEffect(() => {
    if (!open) {
      return
    }

    focusPendingMenuItem()
  }, [focusPendingMenuItem, open])

  if (!open) {
    return null
  }

  function focusItem(nextIndex: number) {
    const items = getEnabledItems()

    if (items.length === 0) {
      contentRef.current?.focus()
      return
    }

    const normalizedIndex = (nextIndex + items.length) % items.length
    items[normalizedIndex]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = getEnabledItems()
    const currentIndex = items.findIndex((item) => item === document.activeElement)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusItem(currentIndex + 1)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusItem(currentIndex - 1)
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusItem(0)
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusItem(items.length - 1)
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      focusItem(currentIndex + (event.shiftKey ? -1 : 1))
    }
  }

  return (
    <div
      {...props}
      id={contentId}
      ref={contentRef}
      role="menu"
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      className={cx(
        'bg-card border-border absolute top-full z-70 mt-1 min-w-[180px] rounded-lg border p-1 opacity-100 shadow-lg transition-opacity',
        align === 'start' ? 'left-0' : 'right-0',
        className
      )}
    >
      {children}
    </div>
  )
}

export type PopoverItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  selected?: boolean
  variant?: 'default' | 'danger'
  closeOnSelect?: boolean
}

export function PopoverItem({
  children,
  leadingIcon,
  trailingIcon,
  selected = false,
  variant = 'default',
  closeOnSelect = true,
  disabled = false,
  className,
  onClick,
  type = 'button',
  ...props
}: PopoverItemProps) {
  const { close } = usePopoverContext('PopoverItem')

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault()
      return
    }

    onClick?.(event)

    if (!event.defaultPrevented && closeOnSelect) {
      close()
    }
  }

  return (
    <button
      {...props}
      type={type}
      role="menuitem"
      data-popover-item="true"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onClick={handleClick}
      className={cx(
        'text-body-sm text-body focus-visible:bg-subtle flex min-h-[36px] w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left transition-colors select-none focus-visible:outline-none',
        selected && 'bg-subtle text-heading font-medium',
        variant === 'default' && !disabled && 'hover:bg-subtle hover:text-heading',
        variant === 'danger' && !disabled && 'text-danger hover:bg-danger-bg',
        disabled && 'text-muted cursor-not-allowed opacity-60 hover:bg-transparent',
        className
      )}
    >
      {leadingIcon ? <span className="shrink-0 text-current">{leadingIcon}</span> : null}
      <span className="min-w-0 flex-1 text-left">{children}</span>
      {trailingIcon ? <span className="shrink-0 text-current">{trailingIcon}</span> : null}
    </button>
  )
}

export type PopoverDividerProps = HTMLAttributes<HTMLDivElement>

export function PopoverDivider({ className, ...props }: PopoverDividerProps) {
  return (
    <div {...props} role="separator" className={cx('border-divider my-1 border-t', className)} />
  )
}
