import { Suspense } from 'react'
import ProblemAnalyzerWizard from '@/components/tools/problem-analyzer/ProblemAnalyzerWizard'

export const metadata = {
  title: 'Problem Analyzer',
  description:
    'Answer a short set of questions about the problem you want to solve. You’ll get a structured read on its strengths, risks, and what you should validate next.',
}

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10">Loading…</div>}>
      <ProblemAnalyzerWizard />
    </Suspense>
  )
}
