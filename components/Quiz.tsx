'use client'

import { useState, useEffect } from 'react'
import type { QuizAnswers } from '@/lib/types'

interface QuizProps {
  answers: QuizAnswers
  setAnswers: (answers: QuizAnswers) => void
  onComplete: () => void
  onBack: () => void
}

type QuestionType = 'single' | 'multi'

interface Question {
  id: keyof QuizAnswers
  number: number
  question: string
  subtitle?: string
  options: string[]
  type: QuestionType
}

const QUESTIONS: Question[] = [
  {
    id: 'age',
    number: 1,
    question: 'How old are you?',
    options: ['Under 45', '45-55', '56-65', '65+'],
    type: 'single',
  },
  {
    id: 'frequency',
    number: 2,
    question: 'How often do you play pickleball?',
    options: ['1x/week', '2-3x/week', '4-5x/week', 'Daily'],
    type: 'single',
  },
  {
    id: 'painAreas',
    number: 3,
    question: 'Which of these has happened to you on court?',
    subtitle: 'Select all that apply',
    options: [
      'Rolled an ankle',
      'Felt a pop or strain mid-game',
      'Had to stop playing from pain',
      'Knee gave out or felt unstable',
      'Stiff lower back after playing',
      'None yet — but I\'m worried',
    ],
    type: 'multi',
  },
  {
    id: 'injuryHistory',
    number: 4,
    question: 'How do you warm up before playing?',
    options: [
      'I go straight to hitting',
      'A few static stretches',
      'Light hitting and some movement',
      'Full structured warm-up routine',
    ],
    type: 'single',
  },
  {
    id: 'biggestFear',
    number: 5,
    question: "What's your biggest fear about your pickleball future?",
    options: [
      'A sudden serious injury that ends my playing days',
      'Chronic pain that slowly grinds me down',
      'Missing games while my friends keep playing',
      'Losing my edge and becoming a liability on court',
    ],
    type: 'single',
  },
]

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-white"
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

export default function Quiz({ answers, setAnswers, onComplete, onBack }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tempMulti, setTempMulti] = useState<string[]>([])
  const [advancing, setAdvancing] = useState(false)

  const q = QUESTIONS[currentIndex]
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100

  // Sync multi-select state when returning to question 3
  useEffect(() => {
    if (currentIndex === 2) {
      setTempMulti([...answers.painAreas])
    }
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const NONE_OPTION = "None yet — but I'm worried"

  const handleMultiToggle = (option: string) => {
    if (option === NONE_OPTION) {
      // Selecting the "none" option clears everything else
      setTempMulti((prev) =>
        prev.includes(NONE_OPTION) ? [] : [NONE_OPTION]
      )
      return
    }
    setTempMulti((prev) => {
      const withoutNone = prev.filter((o) => o !== NONE_OPTION)
      return withoutNone.includes(option)
        ? withoutNone.filter((o) => o !== option)
        : [...withoutNone, option]
    })
  }

  const handleMultiContinue = () => {
    const selection = tempMulti.length > 0 ? tempMulti : [NONE_OPTION]
    const updated = { ...answers, painAreas: selection }
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

          {/* Single-select options */}
          {q.type === 'single' && (
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
          )}

          {/* Multi-select options */}
          {q.type === 'multi' && (
            <div className="space-y-3">
              {q.options.map((option) => {
                const isSelected = tempMulti.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => handleMultiToggle(option)}
                    className={`w-full text-left px-5 py-4 rounded-2xl font-semibold text-base transition-all duration-150 border-2 shadow-sm flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#E8724A] text-white border-[#E8724A] shadow-md'
                        : 'bg-white text-[#1a1f2e] border-transparent hover:border-[#E8724A]/30 hover:shadow-md'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && <CheckIcon />}
                  </button>
                )
              })}

              <button
                onClick={handleMultiContinue}
                className="w-full bg-[#E8724A] text-white font-bold text-lg py-4 rounded-2xl mt-2 hover:bg-[#d4623c] active:scale-95 transition-all duration-150 shadow-lg"
              >
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
