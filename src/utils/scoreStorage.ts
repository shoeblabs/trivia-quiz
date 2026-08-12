import type { SessionScore } from '../types/quiz'

const SCORE_KEY = 'score'
const TOTAL_SCORE_KEY = 'totalScore'

export function getScore(): SessionScore {
  return {
    score: parseInt(localStorage.getItem(SCORE_KEY) || '0', 10) || 0,
    totalScore: parseInt(localStorage.getItem(TOTAL_SCORE_KEY) || '0', 10) || 0,
  }
}

export function setScore(totalScore: number, score: number): void {
  const current = getScore()
  localStorage.setItem(TOTAL_SCORE_KEY, String(current.totalScore + totalScore))
  localStorage.setItem(SCORE_KEY, String(current.score + score))
}

export function resetScore(): void {
  localStorage.setItem(TOTAL_SCORE_KEY, '0')
  localStorage.setItem(SCORE_KEY, '0')
}
