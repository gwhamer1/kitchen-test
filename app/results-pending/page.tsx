'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResultsPendingPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('kt_token')

    if (!token) {
      // No token found — send back to home
      router.replace('/')
      return
    }

    // Consume the token (single use) and forward to the results page
    localStorage.removeItem('kt_token')
    router.replace(`/results?token=${token}`)
  }, [router])

  // Shown briefly while the useEffect runs
  return (
    <div className="min-h-screen bg-[#F5EDE0] flex items-center justify-center px-5">
      <div className="text-center max-w-xs">
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
          Loading your results...
        </h2>
        <p className="text-[#1a1f2e]/50 text-sm leading-relaxed">
          Just a moment while we pull up your report
        </p>
      </div>
    </div>
  )
}
