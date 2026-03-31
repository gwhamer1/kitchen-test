export interface QuizAnswers {
  experience: string
  frequency: string
  bodyStatus: string
  painLocation: string
  biggestFear: string
  pickleballMeaning: string
  wouldAct: string
}

export interface UserInfo {
  name: string
  email: string
}

export type Screen = 'hero' | 'quiz' | 'email' | 'results' | 'thankyou'
