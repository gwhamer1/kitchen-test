import { redirect } from 'next/navigation'
import { Redis } from '@upstash/redis'
import { generateReport } from '@/lib/ai'
import { formatAnswersForAI, extractRiskLevel } from '@/lib/utils'
import ResultsPageClient from '@/components/ResultsPageClient'
import type { QuizAnswers } from '@/lib/types'

const redis = Redis.fromEnv()

interface StoredData {
  name: string
  email: string
  answers: QuizAnswers
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  // No token provided → back to home
  if (!token) {
    redirect('/')
  }

  // Look up token in Redis
  const raw = await redis.get<string>(token)

  // Invalid or expired token → back to home
  if (!raw) {
    redirect('/')
  }

  // Invalidate immediately — single use only
  await redis.del(token)

  // Parse stored data
  let data: StoredData
  try {
    data = typeof raw === 'string' ? JSON.parse(raw) : (raw as StoredData)
  } catch {
    redirect('/')
  }

  const { name, answers } = data

  // Generate the AI report server-side
  const formattedAnswers = formatAnswersForAI(answers)
  const report = await generateReport(formattedAnswers)
  const riskLevel = extractRiskLevel(report)

  return (
    <ResultsPageClient
      report={report}
      riskLevel={riskLevel}
      userName={name}
    />
  )
}
