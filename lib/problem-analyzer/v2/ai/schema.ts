import { z } from 'zod'

export const problemAnalyzerAiSchema = z.object({
  summary: z.string(),
  detail: z.string(),
  recommendation: z.object({
    title: z.string(),
    detail: z.string(),
  }),
  nextFocus: z.object({
    title: z.string(),
    detail: z.string(),
  }),
  insightValidationGuidance: z.array(
    z.object({
      insightId: z.string(),
      nextFocus: z.string(),
    })
  ),
})

export type ProblemAnalyzerAiOutput = z.infer<typeof problemAnalyzerAiSchema>
