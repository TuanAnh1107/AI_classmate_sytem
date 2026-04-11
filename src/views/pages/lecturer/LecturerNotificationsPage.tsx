import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerNotificationsController } from '../../../controllers/lecturer/useLecturerNotificationsController'
import { NotificationInboxShell } from '../../components/shared/NotificationInboxShell'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerNotificationsPageProps = {
  dataState: DataState
  notificationId?: string
}

export function LecturerNotificationsPage({ dataState, notificationId }: LecturerNotificationsPageProps) {
  const model = useLecturerNotificationsController(dataState, notificationId)
  const activeRow = notificationId ? model.rows.find((row) => row.id === notificationId) : undefined

  if (activeRow) {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <div className="page-workspace">
          <section className="portal-section-card portal-page-transition" style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="portal-button-row" style={{ marginBottom: 16 }}>
              <a href="?portal=lecturer&page=notifications" className="portal-outline-button">
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
      </LecturerPortalLayout>
    )
  }

  return (
    <LecturerPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <NotificationInboxShell
          kicker="Thông báo"
          title="Danh sách thông báo"
          description="Chọn một thông báo để xem nội dung chi tiết."
          state={model.state}
          errorMessage={model.errorMessage}
          stats={model.stats}
          rows={model.rows}
          searchValue={model.searchValue}
          onSearchChange={model.onSearchChange}
          filterValue={model.filterValue}
          onFilterChange={model.onFilterChange}
          loadingTitle="Đang tải thông báo"
          loadingDescription="Hệ thống đang lấy các cập nhật mới cho giảng viên."
          emptyTitle="Không có thông báo phù hợp"
          emptyDescription="Thử đổi bộ lọc hoặc quay lại sau khi có cập nhật mới."
        />
      </div>
    </LecturerPortalLayout>
  )
}
