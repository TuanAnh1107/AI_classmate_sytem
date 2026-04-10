import type { StudentDashboardMetric } from '../../../models/student/student.types'
import { CountUp } from '../shared/CountUp'

type DashboardSummaryCardsProps = {
  metrics: StudentDashboardMetric[]
}

export function DashboardSummaryCards({ metrics }: DashboardSummaryCardsProps) {
  return (
    <div className="dashboard-metric-grid">
      {metrics.map((metric) => (
        <article key={metric.id} className={`dashboard-metric-card tone-${metric.tone}`}>
          <p>{metric.label}</p>
          <strong>
            {Number.isFinite(Number(metric.value)) ? <CountUp value={Number(metric.value)} /> : metric.value}
          </strong>
        </article>
      ))}
    </div>
  )
}
