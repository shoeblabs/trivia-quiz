import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { QuizDetails } from '../types/quiz'

interface QuizContextValue {
  quizDetails: QuizDetails | null
  setQuizDetails: (details: QuizDetails) => void
  clearQuizDetails: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizDetails, setQuizDetailsState] = useState<QuizDetails | null>(null)

  const value = useMemo<QuizContextValue>(
    () => ({
      quizDetails,
      setQuizDetails: (details) => setQuizDetailsState(details),
      clearQuizDetails: () => setQuizDetailsState(null),
    }),
    [quizDetails],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
