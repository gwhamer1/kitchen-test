'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Quiz from '@/components/Quiz'
import EmailGate from '@/components/EmailGate'
import Results from '@/components/Results'
import ThankYou from '@/components/ThankYou'
import type { QuizAnswers, UserInfo, Screen } from '@/lib/types'

const defaultAnswers: QuizAnswers = {
  age: '',
  frequency: '',
  painAreas: [],
  injuryHistory: '',
  biggestFear: '',
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('hero')
  const [answers, setAnswers] = useState<QuizAnswers>(defaultAnswers)
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '' })
  const [report, setReport] = useState('')
  const [riskLevel, setRiskLevel] = useState('')

  const handleReset = () => {
    setScreen('hero')
    setAnswers(defaultAnswers)
    setUserInfo({ name: '', email: '' })
    setReport('')
    setRiskLevel('')
  }

  return (
    <main className="min-h-screen bg-[#F5EDE0]">
      {screen === 'hero' && (
        <Hero onStart={() => setScreen('quiz')} />
      )}

      {screen === 'quiz' && (
        <Quiz
          answers={answers}
          setAnswers={setAnswers}
          onComplete={() => setScreen('email')}
          onBack={() => setScreen('hero')}
        />
      )}

      {screen === 'email' && (
        <EmailGate
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          answers={answers}
          setReport={setReport}
          setRiskLevel={setRiskLevel}
          onComplete={() => setScreen('results')}
          onBack={() => setScreen('quiz')}
        />
      )}

      {screen === 'results' && (
        <Results
          report={report}
          riskLevel={riskLevel}
          userName={userInfo.name}
          onReset={handleReset}
        />
      )}

      {screen === 'thankyou' && (
        <ThankYou
          riskLevel={riskLevel}
          userName={userInfo.name}
        />
      )}
    </main>
  )
}
