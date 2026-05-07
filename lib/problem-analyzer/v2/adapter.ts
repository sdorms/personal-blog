import type { QuestionId } from '@/lib/problem-analyzer/schema'
import type { AnswersMap, QuestionConfidenceLevel } from '@/lib/problem-analyzer/score'
import { analyzeProblem, type ResultOutput } from '@/lib/problem-analyzer/v2/interpreter'

export type ProblemAnalyzerV2Input = {
  answers: AnswersMap
  confidenceByQuestion: Partial<Record<QuestionId, QuestionConfidenceLevel>>
}

export type ProblemAnalyzerV2Analysis = {
  problemText: string
  audienceText: string
  input: ProblemAnalyzerV2Input
  output: ResultOutput
}

export function buildProblemAnalyzerV2Input(
  answers: AnswersMap,
  confidenceByQuestion: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): ProblemAnalyzerV2Input {
  return {
    answers: { ...answers },
    confidenceByQuestion: { ...confidenceByQuestion },
  }
}

export function buildProblemAnalyzerV2Analysis(params: {
  problemText: string
  audienceText: string
  answers: AnswersMap
  confidenceByQuestion: Partial<Record<QuestionId, QuestionConfidenceLevel>>
}): ProblemAnalyzerV2Analysis {
  const input = buildProblemAnalyzerV2Input(params.answers, params.confidenceByQuestion)

  return {
    problemText: params.problemText.trim(),
    audienceText: params.audienceText.trim(),
    input,
    output: analyzeProblem(input.answers, input.confidenceByQuestion),
  }
}
