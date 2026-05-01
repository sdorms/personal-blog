import type { Metadata } from 'next'
import ProblemAnalyzerV2TestPage from '@/components/tools/problem-analyzer-v2-test/ProblemAnalyzerV2TestPageStyled'

export const metadata: Metadata = {
  title: 'Problem Analyzer v2 Test',
  description: 'Internal test surface for evaluating Problem Analyzer v2 fixture outputs.',
}

export default function Page() {
  return <ProblemAnalyzerV2TestPage />
}
