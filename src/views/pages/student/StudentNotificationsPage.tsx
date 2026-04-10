import type { DataState } from '../../../models/shared/portal.types'
import { useStudentNotificationsController } from '../../../controllers/student/useStudentNotificationsController'
import { NotificationInboxShell } from '../../components/shared/NotificationInboxShell'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentNotificationsPageProps = {
  dataState: DataState
  notificationId?: string
}

export function StudentNotificationsPage({ dataState, notificationId }: StudentNotificationsPageProps) {
  const model = useStudentNotificationsController(dataState, notificationId)

  return (
    <StudentPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <div className="workflow-command-bar workflow-command-bar-compact">
          <div className="workflow-command-copy">
            <p className="portal-page-kicker">Thông báo</p>
            <h2>Một inbox duy nhất cho cập nhật mới</h2>
            <p>
              Thông báo được gom vào một container duy nhất: tìm kiếm, lọc và nội dung chi tiết đều nằm trong cùng workspace
              để bạn đọc và xử lý mà không phải lướt qua nhiều khối phụ.
            </p>
          </div>
        </div>

        <NotificationInboxShell
          kicker="Hộp thư sinh viên"
          title="Thông báo học tập"
          description="Mặc định chỉ lộ summary và trạng thái đọc/chưa đọc. Nội dung sâu hơn chỉ mở khi bạn chọn một thông báo."
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
          loadingDescription="Hệ thống đang gom các cập nhật mới nhất cho bạn."
          emptyTitle="Không có thông báo phù hợp"
          emptyDescription="Thử đổi bộ lọc hoặc quay lại sau khi có cập nhật mới từ lớp học và giảng viên."
        />
      </section>
    </StudentPortalLayout>
  )
}
