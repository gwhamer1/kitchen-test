import type { QuizAnswers } from '@/lib/types'

export function formatAnswersForAI(answers: QuizAnswers): string {
  return [
    `Q1 – Experience: ${answers.experience}`,
    `Q2 – Frequency: ${answers.frequency}`,
    `Q3 – Body status: ${answers.bodyStatus}`,
    `Q4 – Pain location: ${answers.painLocation}`,
    `Q5 – Biggest fear: ${answers.biggestFear}`,
    `Q6 – What pickleball means to them: ${answers.pickleballMeaning}`,
    `Q7 – Would they act: ${answers.wouldAct}`,
  ].join('\n')
}

export function extractRiskLevel(report: string): string {
  const lower = report.toLowerCase()
  if (lower.includes('elevated risk') || report.includes('🔴')) return 'elevated'
  if (lower.includes('moderate risk') || report.includes('🟡')) return 'moderate'
  if (lower.includes('low risk') || report.includes('🟢')) return 'low'
  return 'moderate'
}
