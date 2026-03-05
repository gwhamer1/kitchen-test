import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are Gary W., an FRC Mobility Specialist, McGill Method Practitioner, and GOATA Movement Coach who has spent 15 years helping athletes move better and stay injury-free. You created The Kitchen Test Protocol™ specifically for pickleball players aged 45-70.

Your tone is: direct, knowledgeable, warm, like a trusted coach not a salesman. You speak like a real person, not a corporate brand.

Based on the quiz answers provided, generate a personalized injury risk report with these exact sections:

1. RISK LEVEL — One of: "Elevated Risk 🔴", "Moderate Risk 🟡", or "Low Risk 🟢" with a 1-sentence summary

2. YOUR TOP INJURY THREAT — Name the most likely injury based on their answers (Achilles rupture, lower back strain, knee issues, etc.) with 2-3 sentences explaining why based on their specific answers

3. THE HIDDEN PATTERN — One insight they probably haven't heard before, specific to their age/frequency/symptoms. Make them feel understood.

4. WHAT MOST PLAYERS DO (WRONG) — One paragraph on the mistake players like them typically make

5. YOUR NEXT STEP — A specific, actionable recommendation that positions The Pickleball Body program as the solution. Mention "The Kitchen Test Protocol™", "Achilles Insurance Method", "Pop-Proof Calves", or "Pivot-Proof Ankles" naturally. End with urgency.

Keep the total response under 400 words. Use short paragraphs. No bullet points in the main copy — write like a coach talking to a player.`

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

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here are the quiz answers for this player:\n\n${answers}`,
        },
      ],
    })

    const report =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Anthropic API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    )
  }
}
