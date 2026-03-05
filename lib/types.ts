export interface QuizAnswers {
  age: string
  frequency: string
  painAreas: string[]
  injuryHistory: string
  biggestFear: string
}

export interface UserInfo {
  name: string
  email: string
}

export type Screen = 'hero' | 'quiz' | 'email' | 'results' | 'thankyou'
