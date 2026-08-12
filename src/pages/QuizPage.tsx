import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getQuestionList } from '../api/opentdb'
import { Timer } from '../components/Timer'
import { useQuiz } from '../context/QuizContext'
import type { QuizQuestion } from '../types/quiz'
import { setScore } from '../utils/scoreStorage'

const QUESTION_TIME = 60
const QUESTION_AMOUNT = 20

export function QuizPage() {
  const navigate = useNavigate()
  const { quizDetails, clearQuizDetails } = useQuiz()

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeCount, setTimeCount] = useState(QUESTION_TIME)
  const [hideQuizBlock, setHideQuizBlock] = useState(true)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [score, setSessionScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const answersRef = useRef<(string | null)[]>([])
  const questionsRef = useRef<QuizQuestion[]>([])
  const currentQuestionRef = useRef(0)
  const advancingRef = useRef(false)

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    questionsRef.current = questions
  }, [questions])

  useEffect(() => {
    currentQuestionRef.current = currentQuestion
  }, [currentQuestion])

  useEffect(() => {
    if (!quizDetails) {
      navigate('/', { replace: true })
      return
    }

    let cancelled = false

    getQuestionList(quizDetails.category.id, quizDetails.difficulty, QUESTION_AMOUNT)
      .then((results) => {
        if (cancelled) return

        if (!results.length) {
          window.alert(
            'Sorry, No data :( ....... Please Try different category or level',
          )
          navigate('/', { replace: true })
          return
        }

        setQuestions(results)
        setAnswers(Array(results.length).fill(null))
        setHideQuizBlock(false)
        setIsLoading(false)
      })
      .catch((error: unknown) => {
        console.error(error)
        if (!cancelled) {
          navigate('/', { replace: true })
        }
      })

    return () => {
      cancelled = true
    }
  }, [quizDetails, navigate])

  function finishQuiz(finalAnswers: (string | null)[], finalQuestions: QuizQuestion[]) {
    let correct = 0
    finalAnswers.forEach((ans, key) => {
      if (ans === finalQuestions[key]?.correct_answer) {
        correct += 1
      }
    })

    setSessionScore(correct)
    setHideQuizBlock(true)
    setShowQuizResult(true)
    setScore(finalQuestions.length, correct)
  }

  function goNext() {
    if (advancingRef.current) return
    advancingRef.current = true

    const index = currentQuestionRef.current
    const qs = questionsRef.current
    const ans = answersRef.current

    if (qs.length === index + 1) {
      finishQuiz(ans, qs)
      return
    }

    setCurrentQuestion(index + 1)
    setTimeCount(QUESTION_TIME)
    advancingRef.current = false
  }

  useEffect(() => {
    if (hideQuizBlock || showQuizResult || isLoading) {
      return
    }

    advancingRef.current = false
    setTimeCount(QUESTION_TIME)

    const timerId = window.setInterval(() => {
      setTimeCount((prev) => {
        if (prev <= 1) {
          window.setTimeout(() => goNext(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [currentQuestion, hideQuizBlock, showQuizResult, isLoading])

  function handleSelectAnswer(answer: string) {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentQuestion] = answer
      return next
    })
  }

  function handlePlayAgain() {
    clearQuizDetails()
  }

  if (!quizDetails) {
    return null
  }

  const question = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const isLastQuestion = questions.length === currentQuestion + 1

  return (
    <div className="quiz-page">
      {isLoading && <div className="loader" aria-label="Loading questions" />}

      {!hideQuizBlock && question && (
        <div className="quiz-wrapper">
          <div className="flex-row flex-center">
            <div className="flex-1">
              <span className="quiz-subheading">Category</span>
              <br />
              <span className="quiz-heading">{quizDetails.category.name}</span>
            </div>
            <Timer timeCount={timeCount} maxTime={QUESTION_TIME} />
            <div className="flex-1 text-right">
              <span className="quiz-subheading">Difficulty Level</span>
              <br />
              <span className="quiz-heading">{quizDetails.difficulty}</span>
            </div>
          </div>

          <div className="question-wrap">
            <p className="info">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h3>
              {currentQuestion + 1}. {question.question}
            </h3>

            {question.answers.map((ans) => (
              <div className="answer" key={ans}>
                <label className="control control--radio">
                  <span>{ans}</span>
                  <input
                    type="radio"
                    name={`ans-${currentQuestion}`}
                    checked={selectedAnswer === ans}
                    onChange={() => handleSelectAnswer(ans)}
                    value={ans}
                  />
                  <div className="control__indicator" />
                </label>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-navy next-btn"
              onClick={goNext}
              disabled={!selectedAnswer}
            >
              {isLastQuestion ? 'FINISH' : 'NEXT'}
            </button>
          </div>
        </div>
      )}

      <div className={`quiz-result flex-column flex-center${showQuizResult ? ' show' : ''}`}>
        <h2>Congratulations {quizDetails.user.name} !!</h2>
        <h3>
          You got {score} out of {questions.length} answers right.
        </h3>
        <Link to="/" className="btn btn-yellow mt20" onClick={handlePlayAgain}>
          Play Again :)
        </Link>
      </div>
    </div>
  )
}
