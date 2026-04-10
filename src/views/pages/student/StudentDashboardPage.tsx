import type { DataState } from '../../../models/shared/portal.types'
import { buildStudentPortalHref } from '../../../models/student/student.mappers'
import { useStudentDashboardController } from '../../../controllers/student/useStudentDashboardController'
import { CollapsibleSection } from '../../components/shared/CollapsibleSection'
import { ContentPanel } from '../../components/shared/ContentPanel'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { MetricBar } from '../../components/shared/MetricBar'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

export function StudentDashboardPage({ dataState }: { dataState: DataState }) {
  const model = useStudentDashboardController(dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <h1>Trang chủ</h1>
        <div className="page-title-bar-actions">
          <a className="portal-outline-button" href={buildStudentPortalHref('notifications')}>
            Thông báo
          </a>
          <a className="portal-primary-button" href={buildStudentPortalHref('assignments')}>
            Đi tới bài tập
          </a>
        </div>
      </div>

      {model.state === 'loading' ? <LoadingState /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}

      {model.state !== 'loading' && model.state !== 'error' ? (
        <div className="student-page-body portal-page-transition">
          <MetricBar items={model.metrics} />

          <ContentPanel
            title="Cần xử lý"
            actions={
              <a className="portal-outline-button" href={buildStudentPortalHref('assignments', { filter: 'not_submitted' })}>
                Xem tất cả
              </a>
            }
          >
            {model.state === 'empty' || !model.upcomingAssignments.length ? (
              <EmptyState
                title="Không có bài gần hạn"
                description="Khi có bài tập cần ưu tiên, chúng sẽ xuất hiện tại đây."
              />
            ) : (
              <div className="compact-list">
                {model.upcomingAssignments.slice(0, 5).map((item) => (
                  <div key={item.id} className="compact-list-item">
                    <div>
                      <a className="compact-list-title" href={item.href}>
                        {item.title}
                      </a>
                      <div className="compact-list-meta">
                        {item.classLabel} · {item.deadlineLabel}
                      </div>
                    </div>
                    <a className="portal-primary-button" href={item.href}>
                      Mở
                    </a>
                  </div>
                ))}
              </div>
            )}
          </ContentPanel>

          <CollapsibleSection title="Kết quả gần đây" count={model.recentResults.length}>
            {model.recentResults.length ? (
              <div className="compact-list">
                {model.recentResults.map((item) => (
                  <div key={item.id} className="compact-list-item">
                    <div>
                      <a className="compact-list-title" href={item.href}>
                        {item.title}
                      </a>
                      <div className="compact-list-meta">
                        {item.classLabel} · {item.updatedAtLabel}
                      </div>
                    </div>
                    <strong>{item.scoreLabel}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Chưa có kết quả mới" description="Điểm mới sẽ xuất hiện ở đây." />
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Phản hồi và thông báo" count={model.feedbackUpdates.length + model.notifications.filter((n) => !n.isRead).length}>
            {model.feedbackUpdates.length ? (
              <div className="compact-list">
                {model.feedbackUpdates.map((item) => (
                  <div key={item.id} className="compact-list-item">
                    <div>
                      <a className="compact-list-title" href={item.href}>
                        {item.title}
                      </a>
                      <div className="compact-list-meta">Cập nhật {item.updatedAtLabel}</div>
                    </div>
                    <a className="portal-outline-button" href={item.href}>
                      Mở
                    </a>
                  </div>
                ))}
              </div>
            ) : null}

            {model.notifications.length ? (
              <div style={{ marginTop: model.feedbackUpdates.length ? '12px' : '0' }}>
                <div className="compact-list">
                  {model.notifications.slice(0, 5).map((item) => (
                    <div key={item.id} className="compact-list-item">
                      <div>
                        <a className="compact-list-title" href={buildStudentPortalHref('notifications', { notificationId: item.id })}>
                          {item.content}
                        </a>
                        <div className="compact-list-meta">{item.createdAt}</div>
                      </div>
                      <StatusBadge label={item.isRead ? 'Đã đọc' : 'Mới'} tone={item.isRead ? 'neutral' : 'info'} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {!model.feedbackUpdates.length && !model.notifications.length ? (
              <EmptyState title="Không có cập nhật" description="Phản hồi và thông báo mới sẽ xuất hiện ở đây." />
            ) : null}
          </CollapsibleSection>
        </div>
      ) : null}
    </StudentPortalLayout>
  )
}
