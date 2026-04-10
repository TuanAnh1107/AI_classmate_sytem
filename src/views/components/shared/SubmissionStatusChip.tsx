import type { SubmissionStatus } from '../../../models/assignment/assignment.types'
import { getSubmissionStatusLabel } from '../../../utils/assignmentUtils'
import { StatusBadge } from './StatusBadge'

type SubmissionStatusChipProps = {
  status: SubmissionStatus | 'not_submitted' | 'missing'
}

export function SubmissionStatusChip({ status }: SubmissionStatusChipProps) {
  const label = status === 'not_submitted' || status === 'missing' ? 'Chưa nộp' : getSubmissionStatusLabel(status)
  const tone =
    status === 'submitted'
      ? 'success'
      : status === 'late'
        ? 'warning'
        : status === 'not_submitted' || status === 'missing'
          ? 'danger'
          : 'info'

  return <StatusBadge label={label} tone={tone} />
}
