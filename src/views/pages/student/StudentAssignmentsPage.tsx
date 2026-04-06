import type { DataState } from '../../../models/shared/portal.types'
import { useStudentAssignmentsController } from '../../../controllers/student/useStudentAssignmentsController'
import { AssignmentsTable } from '../../components/student/AssignmentsTable'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'
import type { AssignmentFilter } from '../../../models/student/student.types'

type StudentAssignmentsPageProps = {
  dataState: DataState
  activeFilter: AssignmentFilter
}

export function StudentAssignmentsPage({ dataState, activeFilter }: StudentAssignmentsPageProps) {
  const model = useStudentAssignmentsController(dataState, activeFilter)

  return (
    <StudentPortalLayout frame={model.frame}>
      <PageSection
        title="Danh sách bài tập"
        kicker="Theo dõi trạng thái"
        description="Lọc bài theo tiến độ nộp và trạng thái chấm để ưu tiên xử lý đúng hạn."
        actions={
          <div className="portal-filter-row">
            {model.filters.map((filter) => (
              <a key={filter.key} href={filter.href} className={`portal-filter-chip${filter.isActive ? ' is-active' : ''}`}>
                {filter.label}
              </a>
            ))}
          </div>
        }
      >
        {model.state === 'loading' ? <LoadingState /> : null}
        {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Không có bài tập phù hợp" description="Hãy đổi bộ lọc hoặc quay lại sau khi lớp học có bài mới." />
        ) : null}
        {model.state === 'ready' ? <AssignmentsTable rows={model.rows} /> : null}
      </PageSection>
    </StudentPortalLayout>
  )
}
