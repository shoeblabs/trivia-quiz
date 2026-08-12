import type { Category, Difficulty, QuizQuestion } from '../types/quiz'
import { decodeHtmlEntities } from '../utils/htmlEntities'
import { shuffleArray } from '../utils/shuffle'

const API_URL = 'https://opentdb.com/'

interface CategoryApiResponse {
  trivia_categories: Category[]
}

interface QuestionsApiResponse {
  response_code: number
  results: Array<{
    category: string
    type: string
    difficulty: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
  }>
}

function cleanCategoryName(name: string): string {
  return name.includes(':') ? name.split(':')[1].trim() : name
}

function mapQuestions(results: QuestionsApiResponse['results']): QuizQuestion[] {
  return results.map((item) => {
    const correct = decodeHtmlEntities(item.correct_answer)
    const incorrect = item.incorrect_answers.map(decodeHtmlEntities)
    const answers = shuffleArray([...incorrect, correct])

    return {
      category: decodeHtmlEntities(item.category),
      type: item.type,
      difficulty: item.difficulty,
      question: decodeHtmlEntities(item.question),
      correct_answer: correct,
      incorrect_answers: incorrect,
      answers,
    }
  })
}

/** Share in-flight requests so React StrictMode remounts do not double-hit OpenTDB. */
const inflight = new Map<string, Promise<unknown>>()

function sharedRequest<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key)
  if (existing) {
    return existing as Promise<T>
  }

  const promise = factory().finally(() => {
    inflight.delete(key)
  })
  inflight.set(key, promise)
  return promise
}

export async function getCategoryList(): Promise<Category[]> {
  return sharedRequest('categories', async () => {
    const response = await fetch(`${API_URL}api_category.php`)
    if (!response.ok) {
      throw new Error(`Failed to load categories (${response.status})`)
    }

    const data = (await response.json()) as CategoryApiResponse
    return data.trivia_categories.map((category) => ({
      ...category,
      name: cleanCategoryName(category.name),
    }))
  })
}

export async function getQuestionList(
  category: number,
  difficulty: Difficulty,
  amount = 20,
): Promise<QuizQuestion[]> {
  const params = new URLSearchParams({
    amount: String(amount),
    category: String(category),
    difficulty,
  })
  const key = `questions:${params.toString()}`

  return sharedRequest(key, async () => {
    const response = await fetch(`${API_URL}api.php?${params.toString()}`)
    if (!response.ok) {
      throw new Error(`Failed to load questions (${response.status})`)
    }

    const data = (await response.json()) as QuestionsApiResponse

    // OpenTDB response_code 0 = success; anything else yields no usable results.
    if (data.response_code !== 0) {
      return []
    }

    return mapQuestions(data.results)
  })
}

/** Categories that historically had medium/hard question pools in the original app. */
export const MEDIUM_CATEGORY_IDS = [9, 10, 11, 12, 14, 15, 17, 18]
export const HARD_CATEGORY_IDS = [9, 11, 12, 15, 18]

export const CARD_COLORS = [
  '#009688',
  '#ef4438',
  '#4caf50',
  '#38a4dd',
  '#ffc107',
  '#8e76b6',
  '#ec407a',
]
