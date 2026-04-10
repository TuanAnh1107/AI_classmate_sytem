import type { AssignmentStatus } from '../../../models/assignment/assignment.types'
import { getAssignmentStatusLabel } from '../../../utils/assignmentUtils'
import { StatusBadge } from './StatusBadge'

type AssignmentStatusChipProps = {
  status: AssignmentStatus
}

export function AssignmentStatusChip({ status }: AssignmentStatusChipProps) {
  const label = getAssignmentStatusLabel(status)
  const tone = status === 'published' ? 'success' : status === 'draft' ? 'info' : 'neutral'
  return <StatusBadge label={label} tone={tone} />
}
