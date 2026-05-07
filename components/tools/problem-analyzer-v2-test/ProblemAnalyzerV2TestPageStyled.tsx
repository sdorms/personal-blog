'use client'

import { useState } from 'react'
import { PROBLEM_ANALYZER_TEST_CASES } from '@/lib/problem-analyzer/v2/fixtures'
import { analyzeProblem } from '@/lib/problem-analyzer/v2/interpreter'
import SignalPill from '@/components/ui/SignalPill'
import ResultHeadline from '@/components/tools/problem-analyzer-v2-test/ResultHeadline'

export default function ProblemAnalyzerV2TestPage() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0)

  const selectedCase =
    PROBLEM_ANALYZER_TEST_CASES[selectedCaseIndex] ?? PROBLEM_ANALYZER_TEST_CASES[0]
  const output = analyzeProblem(selectedCase.answers, selectedCase.confidenceByQuestion)

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <section className="border-border border-b py-5">
          {/* grouping problem + demand signal */}
          <div className="space-y-3">
            {/* Problem statement */}
            <div className="space-y-4">
              <h2 className="text-eyebrow text-body">Problem</h2>

              <p className="text-body-xs text-muted">{selectedCase.problemStatement}</p>
            </div>
            {/* demand signal */}
            <div className="space-y-4">
              <ResultHeadline tone={output.overallAssessment}>{output.summary}</ResultHeadline>
              <p className="text-body-md text-heading">{output.detail}</p>
            </div>
          </div>
        </section>
        <section className="border-border border-b py-5">
          <div className="space-y-4">
            <h2 className="text-eyebrow text-body">Key signals</h2>
            <div className="flex flex-wrap gap-2">
              {output.signals.map((signal) => (
                <SignalPill key={signal.label} label={signal.label} variant={signal.type} />
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
        <section className="border-border border-b py-5">
          <div className="space-y-4">
            <h2 className="text-eyebrow text-body">Confidence</h2>
            <p className="text-h4 text-heading">{output.confidence.level}</p>
            <p className="text-body-sm text-body">{output.confidence.explanation}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
