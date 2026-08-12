export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Category {
  id: number
  name: string
}

export interface UserInfo {
  name: string
  email: string
  mobile?: string
}

export interface QuizDetails {
  category: Category
  difficulty: Difficulty
  user: UserInfo
}

export interface QuizQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
  answers: string[]
}

export interface SessionScore {
  score: number
  totalScore: number
}

export interface QuizResult extends QuizDetails {
  score: number
  totalScore: number
}
