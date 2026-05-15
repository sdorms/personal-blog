import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { buildProblemAnalyzerAiContext } from './context'
import { buildProblemAnalyzerUserPrompt, PROBLEM_ANALYZER_SYSTEM_PROMPT } from './prompt'
import { problemAnalyzerAiSchema } from './schema'
import type { AnswersMap } from '@/lib/problem-analyzer/score'

type GenerateProblemAnalysisInput = {
  problemText: string
  audienceText?: string
  answers: AnswersMap
}

export async function generateProblemAnalysis({
  problemText,
  audienceText,
  answers,
}: GenerateProblemAnalysisInput) {
  const aiContext = buildProblemAnalyzerAiContext({
    problemText,
    audienceText,
    answers,
  })

  const aiContextJson = JSON.stringify(aiContext, null, 2)
  const prompt = buildProblemAnalyzerUserPrompt(aiContextJson)

  console.log('[problem-analyzer-ai] input', {
    problemText,
    audienceText,
    answerKeys: Object.keys(answers),
    aiContextBytes: aiContextJson.length,
    promptBytes: prompt.length,
    validationTargetCount: aiContext.validationTargets.length,
  })

  const startedAt = Date.now()

  const result = await generateText({
    model: openai('gpt-5.4-nano'),

    output: Output.object({
      schema: problemAnalyzerAiSchema,
    }),

    system: PROBLEM_ANALYZER_SYSTEM_PROMPT,

    prompt,
  })

  console.log('[problem-analyzer-ai] output', {
    durationMs: Date.now() - startedAt,
    validationGuidanceCount: result.output.insightValidationGuidance.length,
    output: result.output,
  })

  return result.output
}
