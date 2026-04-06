import type { DataState } from '../../../models/shared/portal.types'
import { useStudentResultsController } from '../../../controllers/student/useStudentResultsController'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'
import { StatusBadge } from '../../components/shared/StatusBadge'

type StudentResultsPageProps = {
  dataState: DataState
}

export function StudentResultsPage({ dataState }: StudentResultsPageProps) {
  const model = useStudentResultsController(dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      <PageSection title="Danh sách kết quả" kicker="Theo dõi điểm số" description="Các bài đã được công bố điểm và phản hồi từ giảng viên.">
        {model.state === 'loading' ? <LoadingState description="Đang tải danh sách kết quả đã công bố." /> : null}
        {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có kết quả nào" description="Điểm và phản hồi sẽ xuất hiện khi giảng viên hoàn tất chấm bài." />
        ) : null}
        {model.state === 'ready' ? (
          <div className="portal-table-shell">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Tên bài</th>
                  <th>Lớp</th>
                  <th>Điểm</th>
                  <th>Ngày cập nhật</th>
                  <th>Trạng thái phản hồi</th>
                </tr>
              </thead>
              <tbody>
                {model.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <a href={row.href} className="portal-table-title-link">
                        {row.title}
                      </a>
                    </td>
                    <td>{row.classLabel}</td>
                    <td>{row.scoreLabel}</td>
                    <td>{row.updatedAtLabel}</td>
                    <td>
                      <StatusBadge label={row.feedbackLabel} tone={row.feedbackTone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </PageSection>
    </StudentPortalLayout>
  )
}
