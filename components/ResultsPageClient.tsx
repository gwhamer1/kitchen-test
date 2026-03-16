'use client'

import { useRouter } from 'next/navigation'
import Results from '@/components/Results'

interface ResultsPageClientProps {
  report: string
  riskLevel: string
  userName: string
}

export default function ResultsPageClient({
  report,
  riskLevel,
  userName,
}: ResultsPageClientProps) {
  const router = useRouter()

  return (
    <Results
      report={report}
      riskLevel={riskLevel}
      userName={userName}
      onReset={() => router.push('/')}
    />
  )
}
