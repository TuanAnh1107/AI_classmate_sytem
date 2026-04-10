import type { DataState } from '../../../models/shared/portal.types'
import { useStudentClassesController } from '../../../controllers/student/useStudentClassesController'
import { ClassesTable } from '../../components/student/ClassesTable'
import { StudentFilterToolbar } from '../../components/student/StudentFilterToolbar'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingTable } from '../../components/shared/LoadingTable'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentClassesPageProps = {
  dataState: DataState
}

export function StudentClassesPage({ dataState }: StudentClassesPageProps) {
  const model = useStudentClassesController(dataState)
  const totalOpenAssignments = model.rows.reduce((sum, row) => sum + Number.parseInt(row.openAssignmentsLabel, 10), 0)
  const averageProgress = model.rows.length
    ? Math.round(model.rows.reduce((sum, row) => sum + row.progressPercent, 0) / model.rows.length)
    : 0

  return (
    <StudentPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <section className="student-focus-hero">
          <div className="student-focus-copy">
            <p className="portal-page-kicker">Classes overview</p>
            <h1>Lớp học đang theo dõi</h1>
            <p>Quét nhanh lớp nào đang nhiều bài mở, lớp nào tiến độ còn thấp và đi thẳng vào lớp cần xử lý tiếp.</p>
          </div>
        </section>

        <div className="student-summary-strip">
          <article className="student-summary-card">
            <span>Tổng lớp</span>
            <strong>{model.rows.length}</strong>
          </article>
          <article className="student-summary-card">
            <span>Bài đang mở</span>
            <strong>{totalOpenAssignments}</strong>
          </article>
          <article className="student-summary-card">
            <span>Tiến độ trung bình</span>
            <strong>{averageProgress}%</strong>
          </article>
        </div>

        <StudentFilterToolbar
          sticky
          search={{
            value: model.searchValue,
            onChange: model.onSearchChange,
            placeholder: 'Tìm theo mã lớp, tên lớp hoặc giảng viên',
            helper: 'Giữ danh sách ngắn gọn để vào đúng lớp cần xem thay vì quét toàn bộ học phần.',
          }}
        />

        {model.state === 'loading' ? <LoadingTable columns={3} /> : null}
        {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có lớp học nào" description="Danh sách lớp sẽ xuất hiện khi sinh viên được ghi danh vào học phần." />
        ) : null}
        {model.state === 'ready' ? <ClassesTable rows={model.rows} /> : null}
      </section>
    </StudentPortalLayout>
  )
}
