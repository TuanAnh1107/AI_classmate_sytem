import type { StudentAssignmentRow } from '../../../models/student/student.types'
import { DataTable } from '../shared/DataTable'
import { DateTimeDisplay } from '../shared/DateTimeDisplay'
import { DeadlineBadge } from '../shared/DeadlineBadge'
import { SubmissionStatusChip } from '../shared/SubmissionStatusChip'
import { StatusBadge } from '../shared/StatusBadge'

type AssignmentsTableProps = {
  rows: StudentAssignmentRow[]
}

export function AssignmentsTable({ rows }: AssignmentsTableProps) {
  return (
    <DataTable headers={['Bài tập', 'Lớp', 'Deadline', 'Trạng thái nộp', 'Trạng thái chấm', 'Điểm']}>
      {rows.map((row) => (
        <tr key={row.id}>
          <td>
            <a href={row.href} className="portal-table-title-link">
              {row.title}
            </a>
          </td>
          <td>{row.classLabel}</td>
          <td>
            <div className="portal-table-stack">
              <DateTimeDisplay value={row.dueAt} />
              <DeadlineBadge assignment={{ dueAt: row.dueAt, allowLateSubmission: row.allowLateSubmission }} />
            </div>
          </td>
          <td>
            <SubmissionStatusChip status={row.submissionStatus} />
          </td>
          <td>
            <StatusBadge label={row.gradingLabel} tone={row.gradingTone} />
          </td>
          <td>{row.scoreLabel}</td>
        </tr>
      ))}
    </DataTable>
  )
}
