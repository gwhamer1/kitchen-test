import { NextRequest, NextResponse } from 'next/server'
import { generateReport } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers } = body

    if (!answers || typeof answers !== 'string') {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const report = await generateReport(answers)
    return NextResponse.json({ report })
  } catch (error) {
    console.error('Anthropic API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    )
  }
}
