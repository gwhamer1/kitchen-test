'use client'

interface ThankYouProps {
  riskLevel: string
  userName: string
}

function getRiskBadge(level: string): { label: string; className: string } {
  switch (level) {
    case 'elevated':
      return { label: 'Elevated Risk 🔴', className: 'bg-red-600 text-white' }
    case 'low':
      return { label: 'Low Risk 🟢', className: 'bg-green-600 text-white' }
    default:
      return { label: 'Moderate Risk 🟡', className: 'bg-yellow-500 text-yellow-950' }
  }
}

export default function ThankYou({ riskLevel, userName }: ThankYouProps) {
  const badge = getRiskBadge(riskLevel)

  return (
    <div className="min-h-screen bg-[#F5EDE0] flex flex-col animate-fadeSlideIn">
      <div className="flex-1 flex flex-col justify-center px-5 py-14 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
            <svg
              className="w-[18px] h-[18px] text-white"
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

        {/* Big success checkmark */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg
            className="w-12 h-12 text-white"
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

        <h2 className="text-[2rem] sm:text-[2.3rem] font-extrabold text-[#1a1f2e] text-center leading-tight mb-4">
          You&apos;re in.{' '}
          {userName ? (
            <>
              {userName},{' '}
              <span className="text-[#E8724A]">check your inbox.</span>
            </>
          ) : (
            <span className="text-[#E8724A]">Check your inbox.</span>
          )}
        </h2>

        <p className="text-[#1a1f2e]/55 text-center leading-relaxed mb-8 text-[0.95rem]">
          Your 5-day Kitchen Test email course starts today. Day 1 arrives in
          the next few minutes — it&apos;s the single most important movement
          test for pickleball players over 50.
        </p>

        {/* Risk level badge */}
        <div className="flex justify-center mb-8">
          <span
            className={`inline-block px-5 py-2 rounded-full text-sm font-bold shadow-sm ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Upsell card */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 mb-6 shadow-xl">
          <p className="text-gray-400 text-sm text-center mb-1 font-medium">
            Want faster results?
          </p>
          <p className="text-white text-center font-semibold mb-5 text-[0.9rem]">
            Don&apos;t wait 5 days. Get everything in one program.
          </p>
          <a
            href="/checkout"
            className="block w-full bg-[#E8724A] text-white font-bold text-base py-4 px-6 rounded-xl text-center hover:bg-[#d4623c] active:scale-95 transition-all duration-150 shadow-lg"
          >
            Grab the full protocol for $97 →
          </a>
        </div>

        {/* Course days teaser */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm">
          <p className="text-[#1a1f2e] font-bold text-sm mb-4">
            What&apos;s coming in your inbox:
          </p>
          <div className="space-y-2.5">
            {[
              { day: 'Day 1', title: 'The Single Most Important Movement Test' },
              { day: 'Day 2', title: 'Why Your Calves Are a Time Bomb' },
              { day: 'Day 3', title: 'The Hip Pattern That Destroys Knees' },
              { day: 'Day 4', title: 'McGill Method — The Back Saver' },
              { day: 'Day 5', title: 'Your Full Kitchen Test Protocol™' },
            ].map(({ day, title }) => (
              <div key={day} className="flex items-start gap-3">
                <span className="text-[#E8724A] font-bold text-xs shrink-0 mt-0.5 w-10">
                  {day}
                </span>
                <span className="text-[#1a1f2e]/65 text-sm leading-snug">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#1a1f2e]/25 text-[0.65rem] leading-relaxed">
          Created by Gary W.&nbsp;|&nbsp;FRC Mobility Specialist&nbsp;|&nbsp;Pickleball Movement Coach
        </p>
      </div>
    </div>
  )
}
