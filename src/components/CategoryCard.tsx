interface CategoryCardProps {
  label: string
  color: string
  onClick: () => void
}

export function CategoryCard({ label, color, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      className="category-card"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
