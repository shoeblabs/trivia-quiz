import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CARD_COLORS,
  getCategoryList,
  HARD_CATEGORY_IDS,
  MEDIUM_CATEGORY_IDS,
} from '../api/opentdb'
import { CategoryCard } from '../components/CategoryCard'
import { useQuiz } from '../context/QuizContext'
import type { Category, Difficulty, UserInfo } from '../types/quiz'
import { getScore } from '../utils/scoreStorage'

const CATEGORY_LIMIT = 10

function pageTitleForStep(step: number): string {
  switch (step) {
    case 2:
      return 'Select Level'
    case 3:
      return 'Enter Personal Details'
    default:
      return 'Select Category'
  }
}

export function HomePage() {
  const navigate = useNavigate()
  const { setQuizDetails } = useQuiz()

  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [user, setUser] = useState<UserInfo>({ name: '', email: '', mobile: '' })
  const [loadError, setLoadError] = useState<string | null>(null)

  const game = useMemo(() => getScore(), [])
  const pageTitle = pageTitleForStep(step)

  useEffect(() => {
    let cancelled = false

    getCategoryList()
      .then((list) => {
        if (!cancelled) {
          setCategories(list.slice(0, CATEGORY_LIMIT))
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('get category error', error)
          setLoadError('Unable to load categories. Please try again.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  function goBack() {
    setStep((current) => Math.max(1, current - 1))
  }

  function handleCategory(category: Category) {
    setSelectedCategory(category)
    setDifficulty(null)
    setStep(2)
  }

  function handleLevel(level: Difficulty) {
    setDifficulty(level)
    setStep(3)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedCategory || !difficulty || !user.name.trim() || !user.email.trim()) {
      return
    }

    setQuizDetails({
      category: selectedCategory,
      difficulty,
      user: {
        name: user.name.trim(),
        email: user.email.trim(),
        mobile: user.mobile?.trim() || undefined,
      },
    })
    navigate('/quiz')
  }

  const showMedium =
    selectedCategory !== null && MEDIUM_CATEGORY_IDS.includes(selectedCategory.id)
  const showHard =
    selectedCategory !== null && HARD_CATEGORY_IDS.includes(selectedCategory.id)

  const mobilePattern = /^[789][0-9]{9}$/
  const mobileValid =
    !user.mobile || user.mobile.length === 0 || mobilePattern.test(user.mobile)
  const formValid =
    user.name.trim().length > 0 &&
    user.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim()) &&
    mobileValid

  return (
    <div className="home-page">
      <h1 className="heading">Welcome to Trivia Quiz</h1>

      <div className="flex-row">
        <div className="flex-1 page-title">{pageTitle}</div>
        {step !== 1 && (
          <button type="button" className="goback" onClick={goBack}>
            Go Back
          </button>
        )}
      </div>

      {step === 1 && (
        <div className="category-wrapper flex-row">
          {isLoading && <div className="loader" aria-label="Loading categories" />}
          {loadError && <p className="error-banner">{loadError}</p>}
          {!isLoading &&
            categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                label={category.name}
                color={CARD_COLORS[index % CARD_COLORS.length]}
                onClick={() => handleCategory(category)}
              />
            ))}
        </div>
      )}

      {step === 2 && selectedCategory && (
        <div className="category-wrapper flex-row dlevel">
          <CategoryCard
            label="Easy"
            color={CARD_COLORS[1]}
            onClick={() => handleLevel('easy')}
          />
          {showMedium && (
            <CategoryCard
              label="Medium"
              color={CARD_COLORS[2]}
              onClick={() => handleLevel('medium')}
            />
          )}
          {showHard && (
            <CategoryCard
              label="Hard"
              color={CARD_COLORS[3]}
              onClick={() => handleLevel('hard')}
            />
          )}
        </div>
      )}

      {step === 3 && (
        <div className="flex-column">
          <form className="form-default" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={user.name}
                onChange={(event) => setUser((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={user.email}
                onChange={(event) => setUser((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                value={user.mobile ?? ''}
                onChange={(event) =>
                  setUser((prev) => ({ ...prev, mobile: event.target.value }))
                }
                minLength={10}
                maxLength={10}
                pattern="^[789][0-9]{9}$"
                placeholder="Optional"
              />
            </div>
            <div className="form-field">
              <p className="error">(Note -You have 60 seconds to answer each question)</p>
            </div>
            <div className="form-field text-right">
              <button type="submit" className="btn btn-navy mt20" disabled={!formValid}>
                START QUIZ
              </button>
            </div>
          </form>
        </div>
      )}

      {game.score > 0 && (
        <div className="main-score">
          Total Score <br />
          {game.score}/{game.totalScore}
        </div>
      )}
    </div>
  )
}
