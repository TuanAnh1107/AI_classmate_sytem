import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useStudentClassesController } from '../../../controllers/student/useStudentClassesController'
import { ClassesTable } from '../../components/student/ClassesTable'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingTable } from '../../components/shared/LoadingTable'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentClassesPageProps = {
  dataState: DataState
}

export function StudentClassesPage({ dataState }: StudentClassesPageProps) {
  const model = useStudentClassesController(dataState)
  const [semesterFilter, setSemesterFilter] = useState('all')

  const semesterOptions = useMemo(() => {
    const values = Array.from(new Set(model.rows.map((row) => row.semester)))
    return ['all', ...values]
  }, [model.rows])

  const visibleRows = useMemo(() => {
    if (semesterFilter === 'all') {
      return model.rows
    }
    return model.rows.filter((row) => row.semester === semesterFilter)
  }, [model.rows, semesterFilter])

  const totalOpenAssignments = visibleRows.reduce((sum, row) => {
    const count = Number.parseInt(row.openAssignmentsLabel, 10)
    return sum + (Number.isNaN(count) ? 0 : count)
  }, 0)

  return (
    <StudentPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <section className="student-sis-shell">
          <header className="student-sis-head">
            <div>
              <p className="portal-page-kicker">Khu học phần</p>
              <h1>Danh sách lớp học</h1>
              <p>Hiển thị theo kiểu bảng học vụ để quét nhanh học phần, lịch học, giảng viên và số bài tập đang mở.</p>
            </div>

            <div className="student-sis-summary">
              <article>
                <span>Tổng lớp</span>
                <strong>{visibleRows.length}</strong>
              </article>
              <article>
                <span>Bài tập mở</span>
                <strong>{totalOpenAssignments}</strong>
              </article>
            </div>
          </header>

          <div className="student-sis-toolbar">
            <div className="student-sis-filter-group">
              <label className="student-sis-filter">
                <span>Kỳ</span>
                <select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)}>
                  {semesterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'Tất cả học kỳ' : option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="student-sis-search">
                <input
                  type="text"
                  placeholder="Nhập mã lớp, mã môn học hoặc tên lớp"
                  value={model.searchValue}
                  onChange={(event) => model.onSearchChange(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="student-sis-tabs">
            <button type="button" className="student-sis-tab is-active">
              Danh sách lớp
            </button>
            <a className="student-sis-tab" href="?portal=student&page=assignments">
              Bài tập
            </a>
            <a className="student-sis-tab" href="?portal=student&page=results">
              Kết quả
            </a>
          </div>

          {model.state === 'loading' ? <LoadingTable columns={6} /> : null}
          {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
          {model.state === 'empty' || !visibleRows.length ? (
            <EmptyState title="Chưa có lớp học nào" description="Danh sách học phần sẽ xuất hiện khi bạn được ghi danh vào lớp." />
          ) : null}

          {model.state === 'ready' && visibleRows.length ? <ClassesTable rows={visibleRows} /> : null}
        </section>
      </section>
    </StudentPortalLayout>
  )
}
