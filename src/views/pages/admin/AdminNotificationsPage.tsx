import type { DataState } from '../../../models/shared/portal.types'
import { useAdminNotificationsController } from '../../../controllers/admin/useAdminNotificationsController'
import { NotificationInboxShell } from '../../components/shared/NotificationInboxShell'
import { AdminPortalLayout } from '../../layouts/AdminPortalLayout'

type AdminNotificationsPageProps = {
  dataState: DataState
  notificationId?: string
}

export function AdminNotificationsPage({ dataState, notificationId }: AdminNotificationsPageProps) {
  const model = useAdminNotificationsController(dataState, notificationId)

  return (
    <AdminPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <div className="workflow-command-bar workflow-command-bar-compact">
          <div className="workflow-command-copy">
            <p className="portal-page-kicker">Notifications</p>
            <h2>Một inbox cảnh báo vận hành duy nhất</h2>
            <p>
              Toàn bộ cảnh báo hệ thống, phân quyền và cập nhật vận hành được gom thành một inbox duy nhất để admin lọc,
              đọc và drill-down mà không bị chia nhỏ thành nhiều module rời.
            </p>
          </div>
        </div>

        <NotificationInboxShell
          kicker="Admin inbox"
          title="Cảnh báo và cập nhật hệ thống"
          description="Summary, trạng thái đọc và nội dung chi tiết được đặt trong một container duy nhất để giảm nhiễu và giữ tập trung vào inbox."
          state={model.state}
          errorMessage={model.errorMessage}
          stats={model.stats}
          rows={model.rows}
          selectedId={model.selectedId}
          searchValue={model.searchValue}
          onSearchChange={model.onSearchChange}
          filterValue={model.filterValue}
          onFilterChange={model.onFilterChange}
          loadingTitle="Đang tải thông báo"
          loadingDescription="Hệ thống đang gom cảnh báo quản trị mới nhất."
          emptyTitle="Không có thông báo phù hợp"
          emptyDescription="Bộ lọc hiện tại chưa khớp thông báo nào."
        />
      </section>
    </AdminPortalLayout>
  )
}
