import type { StudentClassRow } from '../../../models/student/student.types'

type ClassesTableProps = {
  rows: StudentClassRow[]
}

export function ClassesTable({ rows }: ClassesTableProps) {
  return (
    <div className="student-course-table-shell">
      <table className="student-course-table">
        <thead>
          <tr>
            <th style={{ width: 56 }}>STT</th>
            <th>Học phần</th>
            <th style={{ width: 120 }}>Hình thức</th>
            <th style={{ width: 180 }}>Tiến độ</th>
            <th style={{ width: 280 }}>Lịch học</th>
            <th style={{ width: 190 }}>Giảng viên</th>
            <th style={{ width: 140 }}>Bài tập mở</th>
            <th style={{ width: 120 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td className="student-course-index">{index + 1}</td>
              <td>
                <div className="student-course-title-cell">
                  <a className="student-course-link" href={row.href}>
                    {row.title}
                  </a>
                  <div className="student-course-subline">
                    <span>{row.classCode}</span>
                    <span>{row.semester}</span>
                    <span>{row.roomLabel}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="student-course-mode">{row.deliveryMode}</span>
              </td>
              <td>
                <div className="student-course-progress">
                  <strong>{row.progressLabel}</strong>
                  <div className="student-course-progress-bar">
                    <span style={{ width: `${row.progressPercent}%` }} />
                  </div>
                </div>
              </td>
              <td>
                <div className="student-course-schedule">
                  <strong>{row.scheduleLabel}</strong>
                  <span>{row.roomLabel}</span>
                </div>
              </td>
              <td>
                <div className="student-course-lecturer">
                  <strong>{row.lecturerName}</strong>
                </div>
              </td>
              <td>
                <span className="student-course-open">{row.openAssignmentsLabel}</span>
              </td>
              <td>
                <a className="portal-outline-button student-course-action" href={row.href}>
                  Vào lớp
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
