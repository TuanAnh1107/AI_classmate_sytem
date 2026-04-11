import type { DataState } from '../../../models/shared/portal.types'
import { buildStudentPortalHref } from '../../../models/student/student.mappers'
import { useStudentDashboardController } from '../../../controllers/student/useStudentDashboardController'
import { CollapsibleSection } from '../../components/shared/CollapsibleSection'
import { EmptyState } from '../../components/shared/EmptyState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

export function StudentDashboardPage({ dataState }: { dataState: DataState }) {
  const model = useStudentDashboardController(dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}

      {model.state !== 'loading' && model.state !== 'error' ? (
        <div className="page-workspace">
          <InfoHeader
            title="Trang chủ"
            stats={model.metrics.map((m) => ({ label: m.label, value: m.value }))}
            actions={
              <a className="portal-primary-button" href={buildStudentPortalHref('assignments')}>
                Đi tới bài tập
              </a>
            }
          />

          <div className="priority-list">
            <div className="priority-list-header">
              <h2>Cần xử lý</h2>
              <a className="portal-outline-button" href={buildStudentPortalHref('assignments', { filter: 'not_submitted' })}>
                Xem tất cả
              </a>
            </div>
            <div className="priority-list-body">
              {model.state === 'empty' || !model.upcomingAssignments.length ? (
                <EmptyState
                  title="Không có bài gần hạn"
                  description="Khi có bài tập cần ưu tiên, chúng sẽ xuất hiện tại đây."
                />
              ) : (
                model.upcomingAssignments.slice(0, 5).map((item) => (
                  <div key={item.id} className="priority-list-item">
                    <div className="priority-list-item-info">
                      <a className="priority-list-item-title" href={item.href}>
                        {item.title}
                      </a>
                      <div className="priority-list-item-meta">
                        {item.classLabel} · {item.deadlineLabel}
                      </div>
                    </div>
                    <div className="priority-list-item-actions">
                      <a className="portal-primary-button" href={item.href}>
                        Mở
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

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
