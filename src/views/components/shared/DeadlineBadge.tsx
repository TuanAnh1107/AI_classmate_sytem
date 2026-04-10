import type { Assignment } from '../../../models/assignment/assignment.types'
import { canSubmitAssignment, isPastDue } from '../../../utils/assignmentUtils'
import { StatusBadge } from './StatusBadge'

type DeadlineBadgeProps = {
  assignment: Pick<Assignment, 'dueAt' | 'allowLateSubmission'>
}

export function DeadlineBadge({ assignment }: DeadlineBadgeProps) {
  const pastDue = isPastDue(assignment)

  if (!pastDue) {
    return <StatusBadge label="Trong hạn" tone="success" />
  }

  const rule = canSubmitAssignment(assignment)
  if (rule.allowed && assignment.allowLateSubmission) {
    return <StatusBadge label="Quá hạn, vẫn cho nộp trễ" tone="warning" />
  }

  return <StatusBadge label="Đã quá hạn" tone="danger" />
}
