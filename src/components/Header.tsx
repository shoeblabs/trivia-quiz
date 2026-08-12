import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="app-header">
      <Link to="/" aria-label="Trivia Quiz home">
        <img src="/logo.png" alt="Trivia Quiz" className="app-logo" />
      </Link>
    </header>
  )
}
