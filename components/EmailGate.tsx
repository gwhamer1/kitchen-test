'use client'

import { useState, useRef } from 'react'
import type { QuizAnswers, UserInfo } from '@/lib/types'

interface EmailGateProps {
  userInfo: UserInfo
  setUserInfo: (info: UserInfo) => void
  answers: QuizAnswers
  setReport: (report: string) => void
  setRiskLevel: (level: string) => void
  onComplete: () => void
  onBack: () => void
}

function formatAnswersForAI(answers: QuizAnswers): string {
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

function extractRiskLevel(report: string): string {
  const lower = report.toLowerCase()
  if (lower.includes('elevated risk') || report.includes('🔴')) return 'elevated'
  if (lower.includes('moderate risk') || report.includes('🟡')) return 'moderate'
  if (lower.includes('low risk') || report.includes('🟢')) return 'low'
  return 'moderate'
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F5EDE0] flex items-center justify-center px-5 animate-fadeSlideIn">
      <div className="text-center max-w-xs">
        {/* Animated spinner ring */}
        <div className="relative w-20 h-20 mx-auto mb-7">
          <div className="absolute inset-0 rounded-full border-4 border-[#E8724A]/15" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E8724A] animate-spin" />
          <div className="absolute inset-2.5 bg-[#1a1f2e] rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#E8724A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#1a1f2e] mb-2">
          Analyzing your movement patterns...
        </h2>
        <p className="text-[#1a1f2e]/50 text-sm leading-relaxed">
          Building your personalized Kitchen Test™ risk report
        </p>

        {/* Pulsing dots */}
        <div className="flex justify-center gap-2 mt-7">
          {[0, 0.3, 0.6].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#E8724A] rounded-full animate-pulseDot"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function EmailGate({
  userInfo,
  setUserInfo,
  answers,
  setReport,
  setRiskLevel,
  onComplete,
  onBack,
}: EmailGateProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const leadTrackedRef = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInfo.name.trim() || !userInfo.email.trim()) {
      setError('Please fill in both fields.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Await Kit subscription + CSV backup before starting AI analysis.
      // If this fails for any reason, we swallow the error and carry on.
      try {
        await fetch('/api/capture-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userInfo.name.trim(),
            email: userInfo.email.trim(),
            answers,
          }),
        })
      } catch (captureErr) {
        console.error('Email capture failed (non-blocking):', captureErr)
      }

      if (!leadTrackedRef.current) {
        leadTrackedRef.current = true

        // Fire Facebook Pixel Lead event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).fbq) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).fbq('track', 'Lead')
        }

        // Fire Bing UET conversion event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).uetq) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).uetq.push('event', 'submit_lead_form', {})
        }
      }

      // Call the AI analysis endpoint
      const formattedAnswers = formatAnswersForAI(answers)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to generate report')
      }

      const data = await response.json()
      setReport(data.report)
      setRiskLevel(extractRiskLevel(data.report))
      onComplete()
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#F5EDE0] flex flex-col animate-fadeSlideIn">
      <div className="flex-1 flex flex-col justify-center px-5 py-12 max-w-lg mx-auto w-full">
        {/* Mini logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
            <svg
              className="w-4.5 h-4.5 text-white w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-bold text-[#1a1f2e] text-base">
            The Kitchen Test™
          </span>
        </div>

        {/* Shield / unlock icon */}
        <div className="w-14 h-14 bg-[#1a1f2e] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg
            className="w-7 h-7 text-[#E8724A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h2 className="text-[1.9rem] sm:text-[2.1rem] font-extrabold text-[#1a1f2e] leading-tight mb-3">
          Your Risk Report Is Ready
        </h2>

        <p className="text-[#1a1f2e]/55 leading-relaxed mb-8 text-[0.95rem]">
          Enter your email to unlock your personalized Kitchen Test™ results —
          plus a free 5-day injury prevention course.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            type="text"
            placeholder="First name"
            autoComplete="given-name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            className="w-full bg-white border-2 border-transparent focus:border-[#E8724A] outline-none rounded-2xl px-5 py-4 text-[#1a1f2e] font-medium text-base placeholder:text-gray-400 transition-colors shadow-sm"
            required
          />

          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            className="w-full bg-white border-2 border-transparent focus:border-[#E8724A] outline-none rounded-2xl px-5 py-4 text-[#1a1f2e] font-medium text-base placeholder:text-gray-400 transition-colors shadow-sm"
            required
          />

          {error && (
            <p className="text-red-500 text-sm font-medium px-1">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#E8724A] text-white font-bold text-[1.05rem] py-4 px-6 rounded-2xl shadow-lg hover:bg-[#d4623c] active:scale-95 transition-all duration-150 mt-1"
          >
            Show Me My Results →
          </button>
        </form>

        <p className="text-center text-[#1a1f2e]/35 text-xs mt-5 leading-relaxed">
          No spam. Unsubscribe anytime. We hate junk mail too.
        </p>

        <button
          onClick={onBack}
          className="text-center text-[#1a1f2e]/35 text-sm mt-4 hover:text-[#1a1f2e]/55 transition-colors"
        >
          ← Go back
        </button>
      </div>
    </div>
  )
}
