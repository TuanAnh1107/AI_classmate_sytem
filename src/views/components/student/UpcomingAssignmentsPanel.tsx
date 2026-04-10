import type { DashboardUpcomingItem } from '../../../controllers/student/useStudentDashboardController'
import { EmptyState } from '../shared/EmptyState'
import { PageSection } from '../shared/PageSection'

type UpcomingAssignmentsPanelProps = {
  items: DashboardUpcomingItem[]
}

export function UpcomingAssignmentsPanel({ items }: UpcomingAssignmentsPanelProps) {
  return (
    <PageSection title="Bài tập gần hạn" kicker="Cần ưu tiên" description="Các bài còn mở trong vài ngày tới, nên xử lý trước để tránh dồn việc vào sát hạn nộp.">
      {items.length ? (
        <div className="portal-list-block">
          {items.map((item) => (
            <article key={item.id} className="portal-list-item">
              <div>
                <h3>{item.title}</h3>
                <p>{item.classLabel}</p>
              </div>
              <div className="portal-list-meta">
                <span>{item.deadlineLabel}</span>
                <a href={item.href}>Mở bài tập</a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Chưa có bài gần hạn" description="Hiện chưa có bài tập nào cần xử lý gấp trong các ngày tới." />
      )}
    </PageSection>
  )
}
