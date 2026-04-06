import type { StudentDashboardMetric } from '../../../models/student/student.types'

type DashboardSummaryCardsProps = {
  metrics: StudentDashboardMetric[]
}

export function DashboardSummaryCards({ metrics }: DashboardSummaryCardsProps) {
  return (
    <div className="dashboard-metric-grid">
      {metrics.map((metric) => (
        <article key={metric.id} className={`dashboard-metric-card tone-${metric.tone}`}>
          <p>{metric.label}</p>
          <strong>{metric.value}</strong>
        </article>
      ))}
    </div>
  )
}

