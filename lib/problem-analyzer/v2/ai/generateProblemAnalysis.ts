import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { problemAnalyzerAiSchema } from './schema'
import type { ResultOutput } from '@/lib/problem-analyzer/v2/interpreter'

type GenerateProblemAnalysisInput = {
  problemText: string
  audienceText?: string
  resultOutput: ResultOutput
}

export async function generateProblemAnalysis({
  problemText,
  audienceText,
  resultOutput,
}: GenerateProblemAnalysisInput) {
  const result = await generateText({
    model: openai('gpt-4.1-mini'),

    output: Output.object({
      schema: problemAnalyzerAiSchema,
    }),
    system: `
Write a one line story about a cat
`,
    prompt: `
Problem:
${problemText}

Audience:
${audienceText || 'Not specified'}

Deterministic result:
${JSON.stringify(resultOutput, null, 2)}
`,
  })

  console.log(result.output)
  return result.output
}
