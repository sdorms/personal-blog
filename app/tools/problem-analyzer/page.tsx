import { Suspense } from 'react'
import ProblemAnalyzerWizard from '@/components/tools/problem-analyzer/ProblemAnalyzerWizard'

export const metadata = {
  title: 'Problem Analyzer',
  description:
    'Scaffold workflow for evaluating problem quality with placeholder schema, scoring, and confidence overlay.',
}

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10">Loading…</div>}>
      <ProblemAnalyzerWizard />
    </Suspense>
  )
}
