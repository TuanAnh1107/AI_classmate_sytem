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

  return (
    <LecturerPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <div className="workflow-command-bar workflow-command-bar-compact">
          <div className="workflow-command-copy">
            <p className="portal-page-kicker">Thông báo</p>
            <h2>Inbox tín hiệu giảng dạy cần chú ý</h2>
            <p>
              Deadline, bài nộp mới và phản hồi được gom vào một inbox thống nhất. Bạn lọc nhanh theo trạng thái rồi mở sâu
              đúng một thông báo khi cần, thay vì đọc qua nhiều panel cùng lúc.
            </p>
          </div>
        </div>

        <NotificationInboxShell
          kicker="Hộp thư giảng viên"
          title="Tín hiệu cần xử lý"
          description="Danh sách mặc định giữ ở mức summary-first. Chỉ khi chọn thông báo thì nội dung sâu hơn mới được mở ở panel chi tiết."
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
          loadingDescription="Hệ thống đang đồng bộ tín hiệu mới nhất cho giảng viên."
          emptyTitle="Không có thông báo phù hợp"
          emptyDescription="Bộ lọc hiện tại chưa khớp thông báo nào cần chú ý."
        />
      </section>
    </LecturerPortalLayout>
  )
}
