import { NextResponse } from 'next/server'

import { generateProblemAnalysis } from '@/lib/problem-analyzer/v2/ai/generateProblemAnalysis'
import type { AnswersMap } from '@/lib/problem-analyzer/score'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      problemText?: string
      audienceText?: string
      answers?: AnswersMap
    }

    const { problemText, audienceText, answers } = body

    if (!problemText || !answers) {
      return NextResponse.json(
        { aiOutput: null, error: 'Missing problemText or answers' },
        { status: 400 }
      )
    }

    const aiOutput = await generateProblemAnalysis({
      problemText,
      audienceText,
      answers,
    })

    return NextResponse.json({ aiOutput })
  } catch (error) {
    console.error('[problem-analyzer-ai-analysis]', error)

    return NextResponse.json({ aiOutput: null, error: 'AI analysis failed' }, { status: 500 })
  }
}
