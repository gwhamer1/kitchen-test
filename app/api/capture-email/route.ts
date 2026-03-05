import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const apiKey = process.env.KIT_API_KEY
    const formId = process.env.KIT_FORM_ID

    if (!apiKey || !formId) {
      console.warn('[Kit] KIT_API_KEY or KIT_FORM_ID not set — skipping subscription')
      return NextResponse.json({ success: true })
    }

    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email: email.trim(),
          first_name: name.trim(),
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '(no body)')
      console.error(`[Kit] Subscription failed — HTTP ${res.status}: ${text}`)
      return NextResponse.json({ error: 'Kit subscription failed' }, { status: 502 })
    }

    console.log(`[Kit] Subscribed ${email} to form ${formId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Kit] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
