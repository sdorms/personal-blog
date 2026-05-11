'use client'

import ResultHeadline from '@/components/tools/problem-analyzer/ResultHeadline'
import ProgressBar from '@/components/ui/ProgressBar'
import ShareButton from '@/components/ui/ShareButton'
import SignalPill from '@/components/ui/SignalPill'
import type { ResultOutput } from '@/lib/problem-analyzer/v2/interpreter'

type ProblemAnalyzerResultsProps = {
  problemText: string
  audienceText?: string
  output: ResultOutput
}

export default function ProblemAnalyzerResults({
  problemText,
  audienceText,
  output,
}: ProblemAnalyzerResultsProps) {
  return (
    <div className="surface-card">
      <section className="border-border border-b py-5">
        <div className="space-y-3">
          <div className="space-y-4">
            <div className="flex w-full items-end justify-between gap-3">
              <h2 className="text-eyebrow text-body">Problem</h2>
              <ShareButton />
            </div>
            <div className="space-y-3">
              <p className="text-body-xs text-muted">
                {problemText || 'No problem statement provided.'}
              </p>
              {audienceText ? (
                <div className="space-y-1">
                  <h3 className="text-eyebrow text-body">Audience</h3>
                  <p className="text-body-xs text-muted">{audienceText}</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <ResultHeadline tone={output.overallAssessment}>{output.summary}</ResultHeadline>
              <ProgressBar tone={output.overallAssessment} />
            </div>
            <p className="text-body-md text-heading">{output.detail}</p>
          </div>
        </div>
      </section>

      <section className="border-border border-b py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Key signals</h2>
          <div className="flex flex-wrap gap-2">
            {output.signals.map((signal) => (
              <SignalPill
                key={`${signal.type}-${signal.label}`}
                label={signal.label}
                variant={signal.type}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-b py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Recommendation</h2>
          <h3 className="text-h4 text-heading">{output.recommendation.title}</h3>
          <p className="text-body-sm text-body">{output.recommendation.detail}</p>
        </div>
      </section>

      <section className="border-border border-b py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Next Focus</h2>
          <h3 className="text-h4 text-heading">{output.nextFocus.title}</h3>
          <p className="text-body-sm text-body">{output.nextFocus.detail}</p>
        </div>
      </section>
      {/* Hidden confidence section for now but left in case I want to reintroduce in future */}
      {/* <section className="py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Confidence</h2>
          <p className="text-h4 text-heading capitalize">{output.confidence.level}</p>
          <p className="text-body-sm text-body">{output.confidence.explanation}</p>
        </div>
      </section> */}
    </div>
  )
}
