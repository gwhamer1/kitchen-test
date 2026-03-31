'use client'

import { useState } from 'react'
import type { QuizAnswers } from '@/lib/types'

interface QuizProps {
  answers: QuizAnswers
  setAnswers: (answers: QuizAnswers) => void
  onComplete: () => void
  onBack: () => void
}

interface Question {
  id: keyof QuizAnswers
  number: number
  question: string
  subtitle?: string
  options: string[]
}

const QUESTIONS: Question[] = [
  {
    id: 'experience',
    number: 1,
    question: 'How long have you been playing pickleball?',
    options: [
      'Less than 1 year — still figuring it out',
      '1–3 years — getting competitive',
      '3–5 years — this is my sport',
      '5+ years — pickleball is life',
    ],
  },
  {
    id: 'frequency',
    number: 2,
    question: 'How often do you play per week?',
    options: [
      'Once a week or less',
      '2–3 times per week',
      '4–5 times per week',
      'Every day I possibly can',
    ],
  },
  {
    id: 'bodyStatus',
    number: 3,
    question: 'Which best describes your body right now?',
    options: [
      'Feeling great — no issues',
      'A little stiff but it goes away after I warm up',
      'I play through some discomfort most sessions',
      "I have a nagging injury I'm managing around",
    ],
  },
  {
    id: 'painLocation',
    number: 4,
    question: 'Where do you feel it most when you play?',
    options: [
      'Nowhere — I feel fine',
      'Ankles or calves',
      'Knees',
      'Hips or lower back',
      'Shoulder, elbow, or wrist',
    ],
  },
  {
    id: 'biggestFear',
    number: 5,
    question: "What's your biggest fear about staying in the game?",
    options: [
      'Getting a serious injury that sidelines me for months',
      "Slowly breaking down until I can't play anymore",
      'Not being able to keep up with players my age',
      "Having to quit the game I love before I'm ready",
    ],
  },
  {
    id: 'pickleballMeaning',
    number: 6,
    question: 'What does pickleball mean to you?',
    options: [
      "It's my main social life — my people are on that court",
      "It's how I stay active and healthy",
      "It's competitive — I want to keep improving",
      "It's all three — pickleball runs my life",
    ],
  },
  {
    id: 'wouldAct',
    number: 7,
    question:
      'If you knew exactly which part of your body was most likely to get injured first — would you do something about it?',
    options: [
      "100% — I'd fix it immediately",
      "Probably — if it wasn't too complicated",
      "Maybe — I'm not sure what I'd do with that info",
      "Honestly I'd probably just keep playing and hope for the best",
    ],
  },
]

export default function Quiz({ answers, setAnswers, onComplete, onBack }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [advancing, setAdvancing] = useState(false)

  const q = QUESTIONS[currentIndex]
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100

  const advanceTo = (nextIndex: number) => {
    setAdvancing(true)
    setTimeout(() => {
      setAdvancing(false)
      if (nextIndex >= QUESTIONS.length) {
        onComplete()
      } else {
        setCurrentIndex(nextIndex)
      }
    }, 220)
  }

  const handleSingleSelect = (option: string) => {
    if (advancing) return
    const updated = { ...answers, [q.id]: option }
    setAnswers(updated)
    advanceTo(currentIndex + 1)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-[#F5EDE0] flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-[#1a1f2e]/10 h-1.5">
        <div
          className="h-full bg-[#E8724A] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-5 py-7 max-w-lg mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="text-[#1a1f2e]/40 hover:text-[#1a1f2e]/70 transition-colors text-sm font-medium flex items-center gap-1"
          >
            ← Back
          </button>

          {/* Mini logo */}
          <div className="flex items-center gap-2">
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
            <span className="font-bold text-[#1a1f2e] text-sm hidden sm:block">
              The Kitchen Test™
            </span>
          </div>

          <span className="text-[#1a1f2e]/40 text-sm font-medium tabular-nums">
            {currentIndex + 1}/{QUESTIONS.length}
          </span>
        </div>

        {/* Question block — key forces remount for animation */}
        <div
          key={`q-${currentIndex}`}
          className={`flex-1 flex flex-col transition-opacity duration-200 ${
            advancing ? 'opacity-0' : 'opacity-100 animate-fadeSlideIn'
          }`}
        >
          <p className="text-xs font-bold text-[#E8724A] uppercase tracking-widest mb-3">
            Question {q.number}
          </p>

          <h2 className="text-2xl sm:text-[1.75rem] font-extrabold text-[#1a1f2e] leading-tight mb-2">
            {q.question}
          </h2>

          {q.subtitle ? (
            <p className="text-[#1a1f2e]/45 text-sm mb-6">{q.subtitle}</p>
          ) : (
            <div className="mb-7" />
          )}

          <div className="space-y-3">
            {q.options.map((option) => {
              const isSelected = answers[q.id] === option
              return (
                <button
                  key={option}
                  onClick={() => handleSingleSelect(option)}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-semibold text-base transition-all duration-150 border-2 shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-[#E8724A] text-white border-[#E8724A] shadow-md'
                      : 'bg-white text-[#1a1f2e] border-transparent hover:border-[#E8724A]/30 hover:shadow-md'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
