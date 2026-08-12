import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { QuizProvider } from './context/QuizContext'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import './index.css'

export default function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QuizProvider>
  )
}
