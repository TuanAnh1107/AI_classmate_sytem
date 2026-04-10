import type { Assignment, AssignmentStatus, Submission, SubmissionStatus } from '../models/assignment/assignment.types'

export function isPastDue(assignment: Pick<Assignment, 'dueAt'>, now = new Date()) {
  return new Date(assignment.dueAt).getTime() < now.getTime()
}

export function getAssignmentStatusLabel(status: AssignmentStatus) {
  switch (status) {
    case 'draft':
      return 'Bản nháp'
    case 'published':
      return 'Đang mở'
    case 'closed':
    default:
      return 'Đã đóng'
  }
}

export function getSubmissionStatusLabel(status: SubmissionStatus) {
  switch (status) {
    case 'draft':
      return 'Lưu nháp'
    case 'submitted':
      return 'Đã nộp'
    case 'late':
    default:
      return 'Nộp trễ'
  }
}

export function canSubmitAssignment(assignment: Pick<Assignment, 'dueAt' | 'allowLateSubmission'>, now = new Date()) {
  const pastDue = isPastDue(assignment, now)

  if (!pastDue) {
    return { allowed: true, reason: '' }
  }

  if (assignment.allowLateSubmission) {
    return { allowed: true, reason: 'Bài đã quá hạn nhưng lớp vẫn cho phép nộp trễ.' }
  }

  return { allowed: false, reason: 'Bài đã quá hạn và lớp không cho phép nộp trễ.' }
}

export function deriveSubmissionStatus(assignment: Assignment, submission?: Submission, now = new Date()): SubmissionStatus {
  if (!submission) {
    return 'draft'
  }

  if (submission.status === 'late') {
    return 'late'
  }

  if (submission.submittedAt) {
    const pastDue = isPastDue(assignment, now)
    if (pastDue && assignment.allowLateSubmission) {
      return 'late'
    }

    return 'submitted'
  }

  return 'draft'
}
