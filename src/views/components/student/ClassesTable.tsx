import type { StudentClassRow } from '../../../models/student/student.types'

type ClassesTableProps = {
  rows: StudentClassRow[]
}

export function ClassesTable({ rows }: ClassesTableProps) {
  return (
    <div className="portal-table-shell">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Lớp học</th>
            <th>Giảng viên</th>
            <th>Mã lớp</th>
            <th>Bài tập đang mở</th>
            <th>Tiến độ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <a href={row.href} className="portal-table-title-link">
                  {row.title}
                </a>
              </td>
              <td>{row.lecturerName}</td>
              <td>{row.classCode}</td>
              <td>{row.openAssignmentsLabel}</td>
              <td>{row.progressLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
