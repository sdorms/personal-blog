import { NextResponse } from 'next/server'
import { generateProblemAnalysis } from '@/lib/problem-analyzer/v2/ai/generateProblemAnalysis'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const aiOutput = await generateProblemAnalysis({
      problemText: body.problemText,
      audienceText: body.audienceText,
      resultOutput: body.resultOutput,
    })

    return NextResponse.json({ aiOutput })
  } catch (error) {
    console.error('[problem-analyzer-ai-analysis]', error)

    return NextResponse.json({ aiOutput: null, error: 'AI analysis failed' }, { status: 500 })
  }
}
