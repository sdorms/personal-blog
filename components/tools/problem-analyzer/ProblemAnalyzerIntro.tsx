'use client'

import Button from '@/components/ui/Button'

type ProblemAnalyzerIntroProps = {
  onStart: () => void
}

export default function ProblemAnalyzerIntro({ onStart }: ProblemAnalyzerIntroProps) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center">
      {/* Next.js image optimization is intentionally skipped here because this screen requires a plain img tag. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/static/images/too-many-options.svg"
        alt="Illustration showing multiple options"
        width={162}
        height={202}
      />

      <div className="mt-8 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-h1 text-heading">Is this problem worth solving?</h1>

          <p className="text-body text-body max-w-xl">
            Quickly assess whether your problem is worth pursuing, where the biggest risks lie, and
            what to validate before committing serious time and energy.
          </p>

          <p className="text-body text-muted">Time to complete: &lt; 5 minutes.</p>

          <Button type="button" variant="primary" onClick={onStart}>
            Get started
          </Button>
        </div>

        <p className="text-body-xs text-muted mt-6">
          No signup required • Your responses aren’t saved
        </p>
      </div>
    </div>
  )
}
