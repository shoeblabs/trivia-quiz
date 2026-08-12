interface TimerProps {
  timeCount: number
  maxTime?: number
}

const CIRCUMFERENCE = 219.92

export function Timer({ timeCount, maxTime = 60 }: TimerProps) {
  const strokeDashoffset = (CIRCUMFERENCE / maxTime) * (maxTime - timeCount)

  return (
    <div id="cont" data-pct={timeCount} aria-label={`${timeCount} seconds remaining`}>
      <svg id="svg" width="90" height="90" viewBox="0 0 80 80" version="1.1" aria-hidden="true">
        <circle r="35" cx="40" cy="40" fill="transparent" strokeDasharray={CIRCUMFERENCE} />
        <circle
          id="bar"
          r="35"
          cx="40"
          cy="40"
          fill="transparent"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset }}
        />
      </svg>
    </div>
  )
}
