import { z } from 'zod'

export const problemAnalyzerAiSchema = z.object({
  strategicRecommendation: z.string(),
})

export type ProblemAnalyzerAiOutput = z.infer<typeof problemAnalyzerAiSchema>
