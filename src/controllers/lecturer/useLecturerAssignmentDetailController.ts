import type { DataState, StatusTone } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { getClassStudents } from '../../models/rbac/rbac.mappers'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { buildLecturerPortalHref } from '../../models/lecturer/lecturer.mappers'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getDeadlineState } from './lecturer.utils'

export type LecturerAssignmentStudentRow = {
  id: string
  studentName: string
  studentCode: string
  submissionLabel: string
  submissionTone: StatusTone
  attemptsLabel: string
  scoreLabel: string
  feedbackLabel: string
  href?: string
}

export type LecturerAssignmentDetailViewModel = {
  frame: LecturerPageFrame
  state: DataState
  assignment?: typeof assignmentsMock[number]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  submittedStudents: LecturerAssignmentStudentRow[]
  missingStudents: LecturerAssignmentStudentRow[]
  deadlineLabel?: string
  deadlineTone?: 'success' | 'warning' | 'danger'
  allowLateLabel?: string
  errorMessage?: string
}

export function useLecturerAssignmentDetailController(
  assignmentId: string | undefined,
  state: DataState,
): LecturerAssignmentDetailViewModel {
  const shell = useLecturerPortalShellController('assignment-detail')
  const assignment = assignmentsMock.find((item) => item.id === assignmentId)

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: assignment ? assignment.title : 'Chi tiết bài tập',
    pageDescription: 'Theo dõi danh sách đã nộp và chưa nộp trong cùng một màn hình.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildLecturerPortalHref('dashboard') },
      { label: 'Bài tập', href: buildLecturerPortalHref('assignments') },
      { label: assignment?.title ?? 'Chi tiết bài tập' },
    ],
  }

  if (state === 'loading') {
    return { frame, state, stats: [], submittedStudents: [], missingStudents: [] }
  }

  if (state === 'error') {
    return {
      frame,
      state,
      stats: [],
      submittedStudents: [],
      missingStudents: [],
      errorMessage: 'Không thể tải chi tiết bài tập.',
    }
  }

  if (!assignment) {
    return { frame, state: 'empty', stats: [], submittedStudents: [], missingStudents: [] }
  }

  if (assignment.createdBy !== lecturerProfileMock.lecturerCode) {
    return {
      frame,
      state: 'error',
      stats: [],
      submittedStudents: [],
      missingStudents: [],
      errorMessage: 'Bạn không có quyền xem bài tập này.',
    }
  }

  const students = getClassStudents(assignment.classId)
  const submissionList = submissionsMock.filter((item) => item.assignmentId === assignment.id)
  const deadlineState = getDeadlineState(assignment.dueAt)

  const studentRows = students.map((student) => {
    const attempts = submissionList
      .filter((submission) => submission.studentId === student.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    const current = attempts[0]
    const hasSubmission = Boolean(current)

    return {
      id: student.id,
      studentName: student.fullName,
      studentCode: student.id,
      submissionLabel: !current
        ? 'Chưa nộp'
        : current.status === 'late'
          ? 'Nộp trễ'
          : current.status === 'draft'
            ? 'Lưu nháp'
            : 'Đã nộp',
      submissionTone: !current ? ('danger' as StatusTone) : current.status === 'late' ? ('warning' as StatusTone) : ('success' as StatusTone),
      attemptsLabel: `${attempts.length} lần`,
      scoreLabel: current?.score !== undefined ? current.score.toFixed(1) : '--',
      feedbackLabel: current?.feedback ? 'Có phản hồi' : current?.score !== undefined ? 'Đã chấm' : hasSubmission ? 'Chưa phản hồi' : 'Chưa có',
      href: current ? buildLecturerPortalHref('submission-detail', { submissionId: current.id }) : undefined,
    }
  })

  const submittedStudents = studentRows.filter((row) => row.href)
  const missingStudents = studentRows.filter((row) => !row.href)

  const stats = [
    { id: 'students', label: 'Sĩ số', value: String(students.length), tone: 'info' as const },
    { id: 'submitted', label: 'Đã nộp', value: String(submittedStudents.length), tone: 'success' as const },
    { id: 'missing', label: 'Chưa nộp', value: String(missingStudents.length), tone: 'warning' as const },
    {
      id: 'pending',
      label: 'Chờ chấm',
      value: String(submittedStudents.filter((row) => row.scoreLabel === '--').length),
      tone: 'warning' as const,
    },
  ]

  return {
    frame,
    state,
    assignment,
    stats,
    submittedStudents,
    missingStudents,
    deadlineLabel: formatPortalDateTime(assignment.dueAt),
    deadlineTone: deadlineState.tone,
    allowLateLabel: assignment.allowLateSubmission ? 'Cho phép nộp trễ có điều kiện' : 'Không nhận bài trễ hạn',
  }
}
