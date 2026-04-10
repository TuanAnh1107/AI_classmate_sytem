type ProgressBarProps = {
  value: number
  label?: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="portal-progress">
      <div className="portal-progress-track">
        <div className="portal-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
      {label ? <span className="portal-progress-label">{label}</span> : null}
    </div>
  )
}
