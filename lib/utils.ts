import type { QuizAnswers } from '@/lib/types'

export function formatAnswersForAI(answers: QuizAnswers): string {
  const painAreasText =
    answers.painAreas.length > 0 ? answers.painAreas.join(' and ') : 'None yet'

  return [
    `Age: ${answers.age}`,
    `Plays: ${answers.frequency}`,
    `Pain areas: ${painAreasText}`,
    `Injury history: ${answers.injuryHistory}`,
    `Biggest fear: ${answers.biggestFear}`,
  ].join(', ')
}

export function extractRiskLevel(report: string): string {
  const lower = report.toLowerCase()
  if (lower.includes('elevated risk') || report.includes('🔴')) return 'elevated'
  if (lower.includes('moderate risk') || report.includes('🟡')) return 'moderate'
  if (lower.includes('low risk') || report.includes('🟢')) return 'low'
  return 'moderate'
}
