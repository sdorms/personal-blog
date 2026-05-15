import ProblemAnalyzerResults from '@/components/tools/problem-analyzer/ProblemAnalyzerResults'
import type { ProblemAnalyzerV2Analysis } from '@/lib/problem-analyzer/v2/adapter'

export type ResultModel = ProblemAnalyzerV2Analysis

export default function ResultsPanel({ result }: { result: ResultModel }) {
  return (
    <ProblemAnalyzerResults
      problemText={result.problemText}
      audienceText={result.audienceText}
      output={result.output}
      answers={result.answers}
    />
  )
}
