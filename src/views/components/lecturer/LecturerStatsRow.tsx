import { CountUp } from '../shared/CountUp'

export type LecturerStatItem = {
  id: string
  label: string
  value: string
  tone?: 'neutral' | 'info' | 'warning' | 'success'
}

type LecturerStatsRowProps = {
  items: LecturerStatItem[]
}

export function LecturerStatsRow({ items }: LecturerStatsRowProps) {
  return (
    <div className="admin-stats-grid">
      {items.map((item) => (
        <div key={item.id} className={`admin-stat-card${item.tone ? ` tone-${item.tone}` : ''}`}>
          <p>{item.label}</p>
          <strong>
            <StatValue value={item.value} />
          </strong>
        </div>
      ))}
    </div>
  )
}

function StatValue({ value }: { value: string }) {
  const numericValue = Number(value.replace(/,/g, ''))
  if (Number.isNaN(numericValue)) {
    return <>{value}</>
  }
  return <CountUp value={numericValue} format={(val) => Math.round(val).toLocaleString('vi-VN')} />
}
