import type { DataState } from '../../models/shared/portal.types'
import type {
  AssignmentFilter,
  StudentAssignmentRow,
  StudentPageFrame,
} from '../../models/student/student.types'
import { studentAssignmentsMock, studentClassesMock } from '../../models/student/student.mock'
import {
  buildFilterHref,
  buildStudentPortalHref,
  formatPortalDateTime,
  getAssignmentFilterLabel,
  getClassLabel,
  getCompletionLabel,
  getGradingStatusMeta,
  getSubmissionStatusMeta,
} from '../../models/student/student.mappers'
import { useStudentPortalShellController } from './useStudentPortalShellController'

export interface AssignmentFilterChip {
  key: AssignmentFilter
  label: string
  href: string
  isActive: boolean
}

export interface StudentAssignmentsViewModel {
  state: DataState
  frame: StudentPageFrame
  filters: AssignmentFilterChip[]
  rows: StudentAssignmentRow[]
  errorMessage?: string
}

export interface StudentAssignmentDetailViewModel {
  state: DataState
  frame: StudentPageFrame
  assignment?: {
    id: string
    title: string
    classLabel: string
    deadlineLabel: string
    submissionLabel: string
    submissionTone: StudentAssignmentRow['submissionTone']
    gradingLabel: string
    gradingTone: StudentAssignmentRow['gradingTone']
    instructions: string[]
    questions: typeof studentAssignmentsMock[number]['questions']
    requirements: typeof studentAssignmentsMock[number]['requirements']
    allowedSubmissionFormats: string[]
    completionLabel: string
    draftSavedAtLabel?: string
    submittedAtLabel?: string
  }
  errorMessage?: string
}

const assignmentFilters: AssignmentFilter[] = ['all', 'not_submitted', 'submitted', 'late', 'graded']

function matchesFilter(filter: AssignmentFilter, assignment: typeof studentAssignmentsMock[number]) {
  switch (filter) {
    case 'not_submitted':
      return assignment.submissionStatus === 'not_submitted' || assignment.submissionStatus === 'draft'
    case 'submitted':
      return assignment.submissionStatus === 'submitted'
    case 'late':
      return assignment.submissionStatus === 'late'
    case 'graded':
      return assignment.gradingStatus === 'published'
    case 'all':
    default:
      return true
  }
}

export function useStudentAssignmentsController(
  state: DataState,
  activeFilter: AssignmentFilter,
): StudentAssignmentsViewModel {
  const shell = useStudentPortalShellController('assignments')
  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Bài tập',
    pageDescription: 'Theo dõi trạng thái nộp bài, tình trạng chấm và điểm số theo từng học phần.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Bài tập' },
    ],
  }

  const filters: AssignmentFilterChip[] = assignmentFilters.map((filterKey) => ({
    key: filterKey,
    label: getAssignmentFilterLabel(filterKey),
    href: buildFilterHref(filterKey),
    isActive: filterKey === activeFilter,
  }))

  if (state === 'loading') {
    return { state, frame, filters, rows: [] }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      filters,
      rows: [],
      errorMessage: 'Không thể tải danh sách bài tập. Vui lòng thử lại sau.',
    }
  }

  const filteredRows = studentAssignmentsMock
    .filter((assignment) => matchesFilter(activeFilter, assignment))
    .map((assignment) => {
      const studentClass = studentClassesMock.find((item) => item.id === assignment.classId)
      const submissionMeta = getSubmissionStatusMeta(assignment.submissionStatus)
      const gradingMeta = getGradingStatusMeta(assignment.gradingStatus)

      return {
        id: assignment.id,
        title: assignment.title,
        classLabel: studentClass ? getClassLabel(studentClass) : assignment.classId,
        deadlineLabel: formatPortalDateTime(assignment.deadline),
        submissionLabel: submissionMeta.label,
        submissionTone: submissionMeta.tone,
        gradingLabel: gradingMeta.label,
        gradingTone: gradingMeta.tone,
        scoreLabel: assignment.score ? assignment.score.toFixed(1) : '--',
        href: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
      }
    })

  if (state === 'empty') {
    return { state, frame, filters, rows: [] }
  }

  return {
    state,
    frame,
    filters,
    rows: filteredRows,
  }
}

export function useStudentAssignmentDetailController(
  assignmentId: string | undefined,
  state: DataState,
): StudentAssignmentDetailViewModel {
  const shell = useStudentPortalShellController('assignment-detail')
  const assignment = studentAssignmentsMock.find((item) => item.id === assignmentId)
  const studentClass = assignment ? studentClassesMock.find((item) => item.id === assignment.classId) : undefined

  const baseFrame: StudentPageFrame = {
    shell,
    pageTitle: assignment?.title ?? 'Chi tiết bài tập',
    pageDescription: 'Hoàn thành lần lượt từng câu hỏi, lưu nháp khi cần và nộp bài chính thức khi đã đủ minh chứng.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Bài tập', href: buildStudentPortalHref('assignments') },
      { label: assignment?.title ?? 'Chi tiết bài tập' },
    ],
  }

  if (!assignment || !studentClass) {
    return {
      state: 'error',
      frame: baseFrame,
      errorMessage: 'Không tìm thấy bài tập cần mở.',
    }
  }

  if (state === 'loading') {
    return { state, frame: baseFrame }
  }

  const submissionMeta = getSubmissionStatusMeta(assignment.submissionStatus)
  const gradingMeta = getGradingStatusMeta(assignment.gradingStatus)

  if (state === 'error') {
    return {
      state,
      frame: baseFrame,
      errorMessage: 'Không thể tải chi tiết bài tập. Vui lòng thử lại sau.',
    }
  }

  if (state === 'empty') {
    return {
      state,
      frame: baseFrame,
      assignment: {
        id: assignment.id,
        title: assignment.title,
        classLabel: getClassLabel(studentClass),
        deadlineLabel: formatPortalDateTime(assignment.deadline),
        submissionLabel: submissionMeta.label,
        submissionTone: submissionMeta.tone,
        gradingLabel: gradingMeta.label,
        gradingTone: gradingMeta.tone,
        instructions: assignment.instructions,
        questions: [],
        requirements: assignment.requirements,
        allowedSubmissionFormats: assignment.allowedSubmissionFormats,
        completionLabel: '0 câu đã hoàn thành',
      },
    }
  }

  return {
    state,
    frame: baseFrame,
    assignment: {
      id: assignment.id,
      title: assignment.title,
      classLabel: getClassLabel(studentClass),
      deadlineLabel: formatPortalDateTime(assignment.deadline),
      submissionLabel: submissionMeta.label,
      submissionTone: submissionMeta.tone,
      gradingLabel: gradingMeta.label,
      gradingTone: gradingMeta.tone,
      instructions: assignment.instructions,
      questions: assignment.questions,
      requirements: assignment.requirements,
      allowedSubmissionFormats: assignment.allowedSubmissionFormats,
      completionLabel: getCompletionLabel(assignment),
      draftSavedAtLabel: assignment.draftSavedAt ? formatPortalDateTime(assignment.draftSavedAt) : undefined,
      submittedAtLabel: assignment.submittedAt ? formatPortalDateTime(assignment.submittedAt) : undefined,
    },
  }
}
