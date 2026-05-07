'use client'

import { useEffect, useRef, useState } from 'react'
import ActionFeedback from '@/components/ui/ActionFeedback'
import Tooltip from '@/components/ui/Tooltip'
import Icon from '@/components/ui/Icon'

export default function ShareButton() {
  const [showFeedback, setShowFeedback] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)

      setShowFeedback(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setShowFeedback(false)
      }, 1500)
    } catch {
      // Optional later: add error feedback
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const button = (
    <button
      type="button"
      onClick={() => {
        void handleCopy()
      }}
      className="text-body-xs text-muted hover:bg-subtle hover:text-body focus-visible:outline-primary-500 inline-flex items-center gap-1 rounded-[4px] px-1 py-1 focus-visible:outline-2"
      aria-label="Copy link to this page"
    >
      <Icon name="shareNetwork" size="small" className="text-current" />
      <span>Share</span>
    </button>
  )

  return (
    <div className="relative inline-block">
      {showFeedback && <ActionFeedback>Link copied</ActionFeedback>}

      {showFeedback ? button : <Tooltip content="Copy link">{button}</Tooltip>}
    </div>
  )
}
