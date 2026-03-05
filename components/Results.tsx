'use client'

interface ResultsProps {
  report: string
  riskLevel: string
  userName: string
  onReset: () => void
}

interface RiskConfig {
  label: string
  headerBg: string
  headerText: string
  badgeBg: string
  badgeText: string
  accentColor: string
  borderColor: string
}

function getRiskConfig(level: string): RiskConfig {
  switch (level) {
    case 'elevated':
      return {
        label: 'Elevated Risk 🔴',
        headerBg: 'bg-red-950',
        headerText: 'text-red-200',
        badgeBg: 'bg-red-600',
        badgeText: 'text-white',
        accentColor: 'text-red-400',
        borderColor: 'border-red-700',
      }
    case 'low':
      return {
        label: 'Low Risk 🟢',
        headerBg: 'bg-green-950',
        headerText: 'text-green-200',
        badgeBg: 'bg-green-600',
        badgeText: 'text-white',
        accentColor: 'text-green-400',
        borderColor: 'border-green-700',
      }
    default:
      return {
        label: 'Moderate Risk 🟡',
        headerBg: 'bg-yellow-950',
        headerText: 'text-yellow-200',
        badgeBg: 'bg-yellow-500',
        badgeText: 'text-yellow-950',
        accentColor: 'text-yellow-400',
        borderColor: 'border-yellow-700',
      }
  }
}

function renderReport(report: string): React.ReactNode[] {
  if (!report) return []

  const elements: React.ReactNode[] = []
  let key = 0

  const lines = report.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      elements.push(<div key={key++} className="h-3" />)
      continue
    }

    // Section headers: "1. RISK LEVEL — ..." or "1. RISK LEVEL"
    const headerMatch = trimmed.match(/^(\d+)\.\s+([A-Z][A-Z\s()]+?)(?:\s+[—–-]+\s+(.+))?$/)
    if (headerMatch) {
      const sectionLabel = headerMatch[2].trim()
      const sectionHighlight = headerMatch[3]?.trim()

      elements.push(
        <div key={key++} className="mt-6 mb-1.5 first:mt-0">
          <p className="text-[#E8724A] font-bold text-[0.65rem] uppercase tracking-[0.15em]">
            {headerMatch[1]}. {sectionLabel}
          </p>
          {sectionHighlight && (
            <p className="text-white font-bold text-base mt-1">{sectionHighlight}</p>
          )}
        </div>
      )
      continue
    }

    // Risk level line standing alone (e.g. "Elevated Risk 🔴")
    if (
      /elevated risk|moderate risk|low risk/i.test(trimmed) &&
      trimmed.length < 60
    ) {
      elements.push(
        <p key={key++} className="text-white font-bold text-lg">
          {trimmed}
        </p>
      )
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-gray-300 leading-relaxed text-[0.9rem]">
        {trimmed}
      </p>
    )
  }

  return elements
}

export default function Results({
  report,
  riskLevel,
  userName,
  onReset,
}: ResultsProps) {
  const config = getRiskConfig(riskLevel)

  return (
    <div className="min-h-screen bg-[#F5EDE0] pb-12 animate-fadeSlideIn">
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Risk header card */}
        <div
          className={`${config.headerBg} rounded-2xl p-6 mb-4 shadow-xl border ${config.borderColor}`}
        >
          {/* Mini logo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
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
            <span className={`font-bold text-xs ${config.accentColor} opacity-75`}>
              The Kitchen Test™ Report
            </span>
          </div>

          {/* Risk badge */}
          <span
            className={`inline-block px-3.5 py-1.5 rounded-full text-sm font-bold ${config.badgeBg} ${config.badgeText} mb-3`}
          >
            {config.label}
          </span>

          {userName && (
            <p className={`text-sm ${config.headerText} opacity-60`}>
              Personalized report for {userName}
            </p>
          )}
        </div>

        {/* AI Report card */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 mb-4 shadow-xl">
          <div className="space-y-1">{renderReport(report)}</div>
        </div>

        {/* Email course CTA */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 mb-4 shadow-xl">
          <h3 className="text-white font-bold text-lg leading-snug mb-3">
            Your 5-Day Kitchen Test Course Starts Now
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Day 1 hits your inbox in the next few minutes. It&apos;s the single
            most important movement test for pickleball players over 50 — and
            most players have never done it.
          </p>
          <p className="text-[#E8724A]/70 text-xs font-medium">
            Check your spam folder if you don&apos;t see it within 5 minutes.
          </p>
        </div>

        {/* Secondary CTA */}
        <a
          href="https://9363558857049.gumroad.com/l/zzrbt"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-white text-[#1a1f2e] font-semibold text-base py-4 px-6 rounded-2xl text-center border-2 border-[#1a1f2e]/10 hover:border-[#1a1f2e]/20 hover:shadow-sm active:scale-95 transition-all duration-150 mb-8"
        >
          Want faster results? See the full protocol →
        </a>

        {/* Reset button */}
        <button
          onClick={onReset}
          className="w-full text-[#1a1f2e]/35 text-sm py-2 hover:text-[#1a1f2e]/55 transition-colors font-medium"
        >
          ↺ Start Over
        </button>

        {/* Footer */}
        <p className="text-center text-[#1a1f2e]/25 text-[0.65rem] mt-8 leading-relaxed">
          Created by Gary W.&nbsp;|&nbsp;FRC Mobility Specialist&nbsp;|&nbsp;Pickleball Movement Coach
        </p>
      </div>
    </div>
  )
}
