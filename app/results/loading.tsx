export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5EDE0] flex items-center justify-center px-5">
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
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#E8724A] rounded-full animate-pulseDot"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
