'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function ModalDemo() {
  const [open, setOpen] = useState(false)

  return (
    <article className="border-border bg-card rounded-2xl border p-5 shadow-sm">
      <div className="space-y-3">
        <div className="space-y-2">
          <h2 className="text-h5 text-heading">Modal</h2>
          <p className="text-body-md text-body max-w-2xl">
            Reusable dialog surface for confirmations, lightweight forms, and focused tasks. The
            component owns overlay click handling, Escape-to-close, scroll locking, and initial
            focus.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>Open modal example</Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Save changes?"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Save</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Discard
            </Button>
          </>
        }
      >
        You have unsaved edits in this example panel. Save them now to keep your latest updates, or
        discard them to close the dialog without applying changes.
      </Modal>
    </article>
  )
}
