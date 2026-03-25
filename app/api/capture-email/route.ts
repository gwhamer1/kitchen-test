import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, answers } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    // Generate a unique single-use token for this submission
    const token = crypto.randomUUID()

    // Store { name, email, answers } in Upstash Redis with a 7-day expiry (604800 seconds)
    try {
      await redis.set(token, JSON.stringify({ name, email, answers }), { ex: 604800 })
    } catch (kvErr) {
      console.error('[Redis] Failed to store token (non-blocking):', kvErr)
    }

    console.log('[Kit] Generated token:', token)
    const resultsUrl = `https://kitchen-test-eta.vercel.app/results?token=${token}`
    console.log('[Kit] Results URL:', resultsUrl)

    const apiKey = process.env.KIT_API_KEY
    const formId = process.env.KIT_FORM_ID

    if (!apiKey || !formId) {
      console.warn('[Kit] KIT_API_KEY or KIT_FORM_ID not set — skipping subscription')
      return NextResponse.json({ success: true, token })
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
          fields: {
            results_url: resultsUrl,
          },
        }),
      }
    )

    const kitResponseText = await res.text()
    console.log('[Kit] Response status:', res.status)
    console.log('[Kit] Response body:', kitResponseText)

    if (!res.ok) {
      console.error(`[Kit] Subscription failed — HTTP ${res.status}: ${kitResponseText}`)
      return NextResponse.json({ error: 'Kit subscription failed' }, { status: 502 })
    }

    console.log(`[Kit] Subscribed ${email} to form ${formId} with results_url`)
    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('[capture-email] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
