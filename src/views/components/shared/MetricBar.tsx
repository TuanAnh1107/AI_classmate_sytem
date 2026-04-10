import type { StatusTone } from '../../../models/shared/portal.types'

type MetricItem = {
  id: string
  label: string
  value: string
  tone?: StatusTone
}

type MetricBarProps = {
  items: MetricItem[]
}

export function MetricBar({ items }: MetricBarProps) {
  return (
    <div className="metric-bar">
      {items.map((item) => (
        <div key={item.id} className="metric-bar-item">
          <span className="metric-bar-label">{item.label}</span>
          <span className={`metric-bar-value${item.tone ? ` tone-${item.tone}` : ''}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
