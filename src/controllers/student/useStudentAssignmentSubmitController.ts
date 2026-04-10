import type { DataState } from '../../models/shared/portal.types'
import type { AssignmentStatus, SubmissionStatus } from '../../models/assignment/assignment.types'
import type { StudentPageFrame } from '../../models/student/student.types'
import {
  buildStudentPortalHref,
  formatPortalDateTime,
  getCompletionLabel,
  getGradingStatusMeta,
  getSubmissionStatusMeta,
} from '../../models/student/student.mappers'
import { studentAssignmentsMock, studentClassesMock, studentProfileMock } from '../../models/student/student.mock'
import { canStudentViewAssignment } from '../../services/domain/accessControl'
import { canSubmitAssignment } from '../../utils/assignmentUtils'
import { useStudentPortalShellController } from './useStudentPortalShellController'

export type StudentAssignmentSubmitViewModel = {
  frame: StudentPageFrame
  state: DataState
  assignment?: {
    id: string
    title: string
    classLabel: string
    deadlineLabel: string
    dueAt: string
    allowLateSubmission: boolean
    assignmentStatus: AssignmentStatus
    submissionStatus: SubmissionStatus | 'not_submitted'
    submissionLabel: string
    submissionTone: ReturnType<typeof getSubmissionStatusMeta>['tone']
    gradingLabel: ReturnType<typeof getGradingStatusMeta>['label']
    gradingTone: ReturnType<typeof getGradingStatusMeta>['tone']
    instructions: string[]
    questions: typeof studentAssignmentsMock[number]['questions']
    requirements: typeof studentAssignmentsMock[number]['requirements']
    allowedSubmissionFormats: string[]
    completionLabel: string
    submitPolicy: ReturnType<typeof canSubmitAssignment>
  }
  errorMessage?: string
}

export function useStudentAssignmentSubmitController(
  assignmentId: string | undefined,
  dataState: DataState,
): StudentAssignmentSubmitViewModel {
  const shell = useStudentPortalShellController('assignment-submit')
  const assignment = studentAssignmentsMock.find((item) => item.id === assignmentId)
  const studentClass = assignment ? studentClassesMock.find((item) => item.id === assignment.classId) : undefined

  const frame: StudentPageFrame = {
    shell,
    pageTitle: assignment?.title ?? 'Nộp bài tập',
    pageDescription: 'Điền nội dung và gửi bài theo từng câu hỏi.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Bài tập', href: buildStudentPortalHref('assignments') },
      { label: assignment?.title ?? 'Nộp bài tập' },
    ],
  }

  if (!assignment || !studentClass) {
    return {
      frame,
      state: dataState === 'ready' ? 'empty' : dataState,
      errorMessage: 'Không tìm thấy bài tập cần nộp.',
    }
  }

  if (assignmentId && !canStudentViewAssignment(studentProfileMock.id, assignmentId)) {
    return {
      frame,
      state: 'error',
      errorMessage: 'Bạn không có quyền nộp bài cho assignment này.',
    }
  }

  if (dataState === 'error') {
    return {
      frame,
      state: 'error',
      errorMessage: 'Không thể tải biểu mẫu nộp bài. Vui lòng thử lại.',
    }
  }

  const submissionMeta = getSubmissionStatusMeta(assignment.submissionStatus)
  const gradingMeta = getGradingStatusMeta(assignment.gradingStatus)

  return {
    frame,
    state: dataState,
    assignment: {
      id: assignment.id,
      title: assignment.title,
      classLabel: `${studentClass.code} · ${studentClass.name}`,
      deadlineLabel: formatPortalDateTime(assignment.dueAt),
      dueAt: assignment.dueAt,
      allowLateSubmission: assignment.allowLateSubmission,
      assignmentStatus: assignment.status,
      submissionStatus: assignment.submissionStatus,
      submissionLabel: submissionMeta.label,
      submissionTone: submissionMeta.tone,
      gradingLabel: gradingMeta.label,
      gradingTone: gradingMeta.tone,
      instructions: assignment.instructions,
      questions: assignment.questions,
      requirements: assignment.requirements,
      allowedSubmissionFormats: assignment.allowedSubmissionFormats,
      completionLabel: getCompletionLabel(assignment),
      submitPolicy: canSubmitAssignment(assignment),
    },
  }
}
