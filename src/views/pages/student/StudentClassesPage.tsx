import type { DataState } from '../../../models/shared/portal.types'
import { useStudentClassesController } from '../../../controllers/student/useStudentClassesController'
import { ClassesTable } from '../../components/student/ClassesTable'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentClassesPageProps = {
  dataState: DataState
}

export function StudentClassesPage({ dataState }: StudentClassesPageProps) {
  const model = useStudentClassesController(dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      <PageSection title="Danh sách học phần" kicker="Quản lý lớp" description="Theo dõi lớp đang học, giảng viên phụ trách và mức độ hoàn thành bài tập.">
        {model.state === 'loading' ? <LoadingState description="Đang tải danh sách lớp học của sinh viên." /> : null}
        {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có lớp học nào" description="Danh sách lớp sẽ xuất hiện khi sinh viên được ghi danh vào học phần." />
        ) : null}
        {model.state === 'ready' ? <ClassesTable rows={model.rows} /> : null}
      </PageSection>
    </StudentPortalLayout>
  )
}
