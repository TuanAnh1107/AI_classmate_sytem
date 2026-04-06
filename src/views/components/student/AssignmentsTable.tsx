import type { StudentAssignmentRow } from '../../../models/student/student.types'
import { StatusBadge } from '../shared/StatusBadge'

type AssignmentsTableProps = {
  rows: StudentAssignmentRow[]
}

export function AssignmentsTable({ rows }: AssignmentsTableProps) {
  return (
    <div className="portal-table-shell">
      <table className="portal-table">
        <thead>
          <tr>
            <th>Bài tập</th>
            <th>Lớp</th>
            <th>Deadline</th>
            <th>Trạng thái nộp</th>
            <th>Trạng thái chấm</th>
            <th>Điểm</th>
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
              <td>{row.classLabel}</td>
              <td>{row.deadlineLabel}</td>
              <td>
                <StatusBadge label={row.submissionLabel} tone={row.submissionTone} />
              </td>
              <td>
                <StatusBadge label={row.gradingLabel} tone={row.gradingTone} />
              </td>
              <td>{row.scoreLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
