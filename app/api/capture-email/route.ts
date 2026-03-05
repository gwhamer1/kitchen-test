import { NextRequest, NextResponse } from 'next/server'
import { writeFile, appendFile, access } from 'fs/promises'
import path from 'path'

function sanitizeCSV(value: string): string {
  return `"${String(value).replace(/"/g, '""').replace(/\n/g, ' ')}"`
}

/**
 * Subscribe a user to a Kit (ConvertKit) form.
 * Fails silently — never throws, returns a boolean success flag.
 */
async function subscribeToKit(
  email: string,
  firstName: string
): Promise<boolean> {
  const apiKey = process.env.KIT_API_KEY
  const formId = process.env.KIT_FORM_ID

  if (!apiKey || !formId) {
    console.warn('[Kit] KIT_API_KEY or KIT_FORM_ID not set — skipping subscription')
    return false
  }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          first_name: firstName,
        }),
      }
    )

    if (!res.ok) {
      const body = await res.text().catch(() => '(no body)')
      console.error(`[Kit] Subscription failed — HTTP ${res.status}: ${body}`)
      return false
    }

    console.log(`[Kit] Subscribed ${email} to form ${formId}`)
    return true
  } catch (err) {
    console.error('[Kit] Network error during subscription:', err)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, answers } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const painAreas = Array.isArray(answers?.painAreas)
      ? answers.painAreas.join('; ')
      : ''

    // 1. Kit subscription — runs first, awaited, fails silently
    await subscribeToKit(email.trim(), name.trim())

    // 2. Write to local CSV backup
    const row =
      [
        sanitizeCSV(timestamp),
        sanitizeCSV(name),
        sanitizeCSV(email),
        sanitizeCSV(answers?.age || ''),
        sanitizeCSV(answers?.frequency || ''),
        sanitizeCSV(painAreas),
        sanitizeCSV(answers?.injuryHistory || ''),
        sanitizeCSV(answers?.biggestFear || ''),
      ].join(',') + '\n'

    const csvPath = path.join(process.cwd(), 'email-captures.csv')
    try {
      await access(csvPath)
    } catch {
      const header =
        '"Timestamp","Name","Email","Age","Frequency","Pain Areas","Warm-up Habit","Biggest Fear"\n'
      await writeFile(csvPath, header, 'utf8')
    }
    await appendFile(csvPath, row, 'utf8')

    // 3. Optional generic webhook (Make, Zapier, etc.)
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, answers, submittedAt: timestamp }),
        })
      } catch (webhookErr) {
        console.error('[Webhook] Delivery error:', webhookErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}
