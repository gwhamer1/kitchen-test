'use client'

interface HeroProps {
  onStart: () => void
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="min-h-screen bg-[#F5EDE0] relative flex flex-col animate-fadeSlideIn">
      {/* Privacy badge — floating top-right */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
        <span className="text-sm leading-none">🔒</span>
        <span className="text-xs text-gray-500 font-medium">Your results are private</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-5 py-16 max-w-lg mx-auto w-full">
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <CheckIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[#1a1f2e] text-lg tracking-tight">
            The Kitchen Test™
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-[#1a1f2e] leading-[1.15] mb-5">
          Most Pickleball Players Over 50 Have a{' '}
          <span className="text-[#E8724A]">Hidden Injury</span>{' '}
          Waiting to Happen
        </h1>

        {/* Subheadline */}
        <p className="text-[1.05rem] text-[#1a1f2e]/65 font-medium mb-7 leading-relaxed">
          Take the 3-minute Kitchen Test™ to find out which one will sideline
          you — before it happens.
        </p>

        {/* Mike story card */}
        <div className="bg-[#1a1f2e] rounded-2xl px-5 py-5 mb-8 shadow-lg">
          <p className="text-gray-300 leading-relaxed text-sm">
            Mike thought he was fine. He wasn&apos;t. 6 weeks off the court,{' '}
            <span className="text-[#E8724A] font-semibold">
              $1,800 in physio bills
            </span>
            , and his Thursday crew played without him. A 3-minute test would
            have caught it.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onStart}
          className="w-full bg-[#E8724A] text-white font-bold text-[1.1rem] py-4 px-6 rounded-2xl shadow-lg hover:bg-[#d4623c] active:scale-95 transition-all duration-150 mb-3"
        >
          Find My Injury Risk →
        </button>

        {/* Social proof */}
        <p className="text-center text-[#1a1f2e]/45 text-sm font-medium mb-10">
          Free&nbsp;&nbsp;•&nbsp;&nbsp;Takes 3 minutes&nbsp;&nbsp;•&nbsp;&nbsp;Used by 200+ players
        </p>

        {/* Tagline */}
        <p className="text-center text-[#1a1f2e]/25 text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
          Know Before You Blow
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center text-[#1a1f2e]/25 text-[0.65rem] pb-5 px-5 leading-relaxed">
        Created by Gary W.&nbsp;|&nbsp;FRC Mobility Specialist&nbsp;|&nbsp;Pickleball Movement Coach
      </footer>
    </div>
  )
}
