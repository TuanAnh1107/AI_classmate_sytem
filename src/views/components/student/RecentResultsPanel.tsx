import type { DashboardResultItem } from '../../../controllers/student/useStudentDashboardController'
import { EmptyState } from '../shared/EmptyState'
import { PageSection } from '../shared/PageSection'

type RecentResultsPanelProps = {
  items: DashboardResultItem[]
}

export function RecentResultsPanel({ items }: RecentResultsPanelProps) {
  return (
    <PageSection title="Kết quả mới" kicker="Cập nhật gần đây" description="Điểm và phản hồi vừa được công bố trong tuần học này.">
      {items.length ? (
        <div className="portal-list-block compact">
          {items.map((item) => (
            <article key={item.id} className="portal-list-item compact">
              <div>
                <h3>{item.title}</h3>
                <p>{item.classLabel}</p>
              </div>
              <div className="portal-list-meta">
                <strong>{item.scoreLabel}</strong>
                <span>{item.updatedAtLabel}</span>
                <a href={item.href}>Xem chi tiết</a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Chưa có kết quả mới" description="Khi giảng viên công bố điểm, nội dung sẽ hiển thị tại đây." />
      )}
    </PageSection>
  )
}
