import type { DataState } from '../../../models/shared/portal.types'
import { useStudentNotificationsController } from '../../../controllers/student/useStudentNotificationsController'
import { EmptyState } from '../../components/shared/EmptyState'
import { NotificationInboxShell } from '../../components/shared/NotificationInboxShell'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentNotificationsPageProps = {
  dataState: DataState
  notificationId?: string
}

export function StudentNotificationsPage({ dataState, notificationId }: StudentNotificationsPageProps) {
  const model = useStudentNotificationsController(dataState, notificationId)
  const activeRow = notificationId ? model.rows.find((row) => row.id === notificationId) : undefined

  if (activeRow) {
    return (
      <StudentPortalLayout frame={model.frame}>
        <div className="page-workspace">
          <section className="portal-section-card portal-page-transition" style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="portal-button-row" style={{ marginBottom: 16 }}>
              <a href="?portal=student&page=notifications" className="portal-outline-button">
                Quay lại danh sách
              </a>
            </div>

            <div className="content-panel" style={{ border: 'none', padding: 0, boxShadow: 'none' }}>
              <p className="portal-section-kicker">Thông báo</p>
              <h2 style={{ marginBottom: 8 }}>Chi tiết thông báo</h2>
              <p className="portal-muted-text" style={{ marginBottom: 16 }}>{activeRow.createdAtLabel}</p>
              <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{activeRow.content}</div>
            </div>
          </section>
        </div>
      </StudentPortalLayout>
    )
  }

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <NotificationInboxShell
          kicker="Thông báo"
          title="Danh sách thông báo"
          description="Mở từng thông báo để xem nội dung chi tiết."
          state={model.state}
          errorMessage={model.errorMessage}
          stats={model.stats}
          rows={model.rows}
          searchValue={model.searchValue}
          onSearchChange={model.onSearchChange}
          filterValue={model.filterValue}
          onFilterChange={model.onFilterChange}
          loadingTitle="Đang tải thông báo"
          loadingDescription="Hệ thống đang lấy danh sách thông báo mới cho bạn."
          emptyTitle="Không có thông báo phù hợp"
          emptyDescription="Thử đổi bộ lọc hoặc quay lại sau khi có cập nhật mới."
        />

        {model.state === 'empty' && !model.rows.length ? (
          <EmptyState title="Chưa có thông báo" description="Khi có cập nhật mới, danh sách sẽ xuất hiện tại đây." />
        ) : null}
      </div>
    </StudentPortalLayout>
  )
}
