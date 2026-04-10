import type { DataState, StatusTone } from '../../models/shared/portal.types'
import type { AssignmentFilter, AssignmentSort, StudentPageFrame } from '../../models/student/student.types'
import {
  feedbackThreadsMock,
  studentAssignmentsMock,
  studentClassesMock,
  studentProfileMock,
  studentResultsMock,
} from '../../models/student/student.mock'
import {
  buildStudentPortalHref,
  formatPortalDateTime,
  getClassLabel,
  getCompletionLabel,
  getGradingStatusMeta,
  getSubmissionStatusMeta,
} from '../../models/student/student.mappers'
import { canStudentViewAssignment } from '../../services/domain/accessControl'
import { useStudentPortalShellController } from './useStudentPortalShellController'
import { useStudentQueryParams } from './useStudentQueryParams'

export interface AssignmentFilterChip {
  key: AssignmentFilter
  label: string
  href: string
  isActive: boolean
  count: number
}

export interface StudentAssignmentClassCard {
  id: string
  code: string
  name: string
  lecturerName: string
  helperText: string
  openAssignmentsLabel: string
  progressLabel: string
  href: string
  isActive: boolean
}

export interface StudentAssignmentListItem {
  id: string
  title: string
  classLabel: string
  summary: string
  deadlineLabel: string
  deadlineTone: StatusTone
  statusLabel: string
  statusTone: StatusTone
  scoreLabel?: string
  primaryActionLabel: string
  primaryActionHref: string
  secondaryActionHref: string
  secondaryActionLabel: string
}

export interface StudentAssignmentsViewModel {
  state: DataState
  frame: StudentPageFrame
  classes: StudentAssignmentClassCard[]
  selectedClass?: {
    id: string
    title: string
    lecturerName: string
    overview: string
  }
  filters: AssignmentFilterChip[]
  rows: StudentAssignmentListItem[]
  searchValue: string
  sortValue: AssignmentSort
  onSearchChange: (value: string) => void
  onSortChange: (value: AssignmentSort) => void
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
    dueAt: string
    allowLateSubmission: boolean
    assignmentStatus: typeof studentAssignmentsMock[number]['status']
    submissionLabel: string
    submissionTone: StatusTone
    gradingLabel: string
    gradingTone: StatusTone
    instructions: string[]
    questions: typeof studentAssignmentsMock[number]['questions']
    requirements: typeof studentAssignmentsMock[number]['requirements']
    allowedSubmissionFormats: string[]
    completionLabel: string
    draftSavedAtLabel?: string
    submittedAtLabel?: string
    description: string
    resourceLinks: typeof studentAssignmentsMock[number]['resourceLinks']
    feedbackMessages: typeof feedbackThreadsMock[number]['messages']
    resultSummary?: {
      totalScore: number
      maxScore: number
      lecturerFeedback: string
      updatedAtLabel: string
      resultHref: string
    }
  }
  errorMessage?: string
}

const assignmentFilters: AssignmentFilter[] = ['not_submitted', 'submitted', 'overdue']

function matchesFilter(filter: AssignmentFilter, assignment: typeof studentAssignmentsMock[number]) {
  const dueTime = new Date(assignment.dueAt).getTime()
  const isOverdue = dueTime < Date.now() && (assignment.submissionStatus === 'not_submitted' || assignment.submissionStatus === 'draft')

  switch (filter) {
    case 'not_submitted':
      return !isOverdue && (assignment.submissionStatus === 'not_submitted' || assignment.submissionStatus === 'draft')
    case 'submitted':
      return assignment.submissionStatus === 'submitted' || assignment.submissionStatus === 'late'
    case 'overdue':
      return isOverdue
    case 'all':
    default:
      return true
  }
}

function sortAssignments(sort: AssignmentSort, assignments: typeof studentAssignmentsMock) {
  const sorted = [...assignments]

  switch (sort) {
    case 'deadline':
      sorted.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
      break
    case 'status':
      sorted.sort((a, b) => a.submissionStatus.localeCompare(b.submissionStatus))
      break
    case 'recent':
    default:
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
  }

  return sorted
}

function getAssignmentDisplayMeta(assignment: typeof studentAssignmentsMock[number]) {
  const dueTime = new Date(assignment.dueAt).getTime()
  const isOverdue = dueTime < Date.now() && (assignment.submissionStatus === 'not_submitted' || assignment.submissionStatus === 'draft')
  const result = studentResultsMock.find((item) => item.assignmentId === assignment.id)

  if (isOverdue) {
    return {
      statusLabel: 'Quá hạn',
      statusTone: 'danger' as StatusTone,
      primaryActionLabel: 'Xem chi tiết',
      primaryActionHref: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
    }
  }

  if (result) {
    return {
      statusLabel: `Điểm ${result.totalScore.toFixed(1)}/${result.maxScore}`,
      statusTone: 'success' as StatusTone,
      primaryActionLabel: 'Xem kết quả',
      primaryActionHref: buildStudentPortalHref('result-detail', { resultId: result.id }),
    }
  }

  if (assignment.submissionStatus === 'submitted' || assignment.submissionStatus === 'late') {
    return {
      statusLabel: 'Chưa có điểm',
      statusTone: 'info' as StatusTone,
      primaryActionLabel: 'Xem chi tiết',
      primaryActionHref: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
    }
  }

  return {
    statusLabel: 'Chưa nộp',
    statusTone: 'warning' as StatusTone,
    primaryActionLabel: assignment.submissionStatus === 'draft' ? 'Tiếp tục nộp bài' : 'Xem chi tiết',
    primaryActionHref:
      assignment.submissionStatus === 'draft'
        ? buildStudentPortalHref('assignment-submit', { assignmentId: assignment.id })
        : buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
  }
}

function getDeadlineTone(dueAt: string): StatusTone {
  const diff = new Date(dueAt).getTime() - Date.now()
  if (diff < 0) {
    return 'danger'
  }
  if (diff <= 1000 * 60 * 60 * 24 * 3) {
    return 'warning'
  }
  return 'neutral'
}

export function useStudentAssignmentsController(
  state: DataState,
  activeFilter: AssignmentFilter,
): StudentAssignmentsViewModel {
  const shell = useStudentPortalShellController('assignments')
  const { query, setQuery } = useStudentQueryParams()
  const safeSort: AssignmentSort =
    query.sort === 'deadline' || query.sort === 'status' || query.sort === 'recent' ? query.sort : 'deadline'
  const selectedClassId =
    query.classId !== 'all' && studentClassesMock.some((item) => item.id === query.classId)
      ? query.classId
      : studentClassesMock[0]?.id

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Bài tập',
    pageDescription: 'Chọn lớp trước, sau đó tập trung vào đúng nhóm bài cần xử lý để không bị loãng thông tin.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Bài tập' },
    ],
  }

  const classAssignments = studentAssignmentsMock.filter((assignment) => assignment.classId === selectedClassId)
  const selectedClass = studentClassesMock.find((item) => item.id === selectedClassId)

  const classes = studentClassesMock.map((studentClass) => {
    const rows = studentAssignmentsMock.filter((assignment) => assignment.classId === studentClass.id)
    const nextDeadline = rows
      .slice()
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
      .find((assignment) => assignment.status !== 'closed')

    return {
      id: studentClass.id,
      code: studentClass.code,
      name: studentClass.name,
      lecturerName: studentClass.lecturerName,
      helperText: nextDeadline ? `Hạn gần nhất ${formatPortalDateTime(nextDeadline.dueAt)}` : 'Chưa có hạn nộp mới',
      openAssignmentsLabel: `${rows.filter((assignment) => assignment.status === 'published').length} bài đang mở`,
      progressLabel: `${rows.filter((assignment) => assignment.gradingStatus === 'published').length}/${rows.length} bài đã có điểm`,
      href: buildStudentPortalHref('assignments', {
        classId: studentClass.id,
        filter: activeFilter,
        q: query.search || undefined,
        sort: safeSort,
      }),
      isActive: studentClass.id === selectedClassId,
    }
  })

  const filters = assignmentFilters.map((filterKey) => ({
    key: filterKey,
    label: filterKey === 'not_submitted' ? 'Chưa nộp' : filterKey === 'submitted' ? 'Đã nộp' : 'Quá hạn',
    href: buildStudentPortalHref('assignments', {
      filter: filterKey,
      classId: selectedClassId,
      q: query.search || undefined,
      sort: safeSort,
    }),
    isActive: filterKey === activeFilter,
    count: classAssignments.filter((assignment) => matchesFilter(filterKey, assignment)).length,
  }))

  const onSearchChange = (value: string) => setQuery({ search: value })
  const onSortChange = (value: AssignmentSort) => setQuery({ sort: value })

  if (state === 'loading') {
    return {
      state,
      frame,
      classes,
      selectedClass: selectedClass
        ? {
            id: selectedClass.id,
            title: getClassLabel(selectedClass),
            lecturerName: selectedClass.lecturerName,
            overview: selectedClass.overview,
          }
        : undefined,
      filters,
      rows: [],
      searchValue: query.search,
      sortValue: safeSort,
      onSearchChange,
      onSortChange,
    }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      classes,
      selectedClass: selectedClass
        ? {
            id: selectedClass.id,
            title: getClassLabel(selectedClass),
            lecturerName: selectedClass.lecturerName,
            overview: selectedClass.overview,
          }
        : undefined,
      filters,
      rows: [],
      searchValue: query.search,
      sortValue: safeSort,
      onSearchChange,
      onSortChange,
      errorMessage: 'Không thể tải khu vực bài tập vào lúc này.',
    }
  }

  const rows = sortAssignments(safeSort, classAssignments)
    .filter((assignment) => matchesFilter(activeFilter, assignment))
    .filter((assignment) => {
      if (!query.search) {
        return true
      }

      const keyword = query.search.toLowerCase()
      return (
        assignment.title.toLowerCase().includes(keyword) ||
        assignment.description.toLowerCase().includes(keyword) ||
        assignment.id.toLowerCase().includes(keyword)
      )
    })
    .map((assignment) => {
      const meta = getAssignmentDisplayMeta(assignment)
      return {
        id: assignment.id,
        title: assignment.title,
        classLabel: selectedClass ? getClassLabel(selectedClass) : assignment.classId,
        summary: assignment.description,
        deadlineLabel: formatPortalDateTime(assignment.dueAt),
        deadlineTone: getDeadlineTone(assignment.dueAt),
        statusLabel: meta.statusLabel,
        statusTone: meta.statusTone,
        scoreLabel: assignment.score !== undefined ? `${assignment.score.toFixed(1)}/${assignment.maxScore}` : undefined,
        primaryActionLabel: meta.primaryActionLabel,
        primaryActionHref: meta.primaryActionHref,
        secondaryActionHref: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
        secondaryActionLabel: 'Xem chi tiết',
      }
    })

  if (state === 'empty' || !selectedClass || !rows.length) {
    return {
      state: 'empty',
      frame,
      classes,
      selectedClass: selectedClass
        ? {
            id: selectedClass.id,
            title: getClassLabel(selectedClass),
            lecturerName: selectedClass.lecturerName,
            overview: selectedClass.overview,
          }
        : undefined,
      filters,
      rows: [],
      searchValue: query.search,
      sortValue: safeSort,
      onSearchChange,
      onSortChange,
    }
  }

  return {
    state,
    frame,
    classes,
    selectedClass: {
      id: selectedClass.id,
      title: getClassLabel(selectedClass),
      lecturerName: selectedClass.lecturerName,
      overview: selectedClass.overview,
    },
    filters,
    rows,
    searchValue: query.search,
    sortValue: safeSort,
    onSearchChange,
    onSortChange,
  }
}

export function useStudentAssignmentDetailController(
  assignmentId: string | undefined,
  state: DataState,
): StudentAssignmentDetailViewModel {
  const shell = useStudentPortalShellController('assignment-detail')
  const assignment = studentAssignmentsMock.find((item) => item.id === assignmentId)
  const studentClass = assignment ? studentClassesMock.find((item) => item.id === assignment.classId) : undefined
  const result = assignment ? studentResultsMock.find((item) => item.assignmentId === assignment.id) : undefined
  const feedbackThread = assignment ? feedbackThreadsMock.find((item) => item.assignmentId === assignment.id) : undefined

  const baseFrame: StudentPageFrame = {
    shell,
    pageTitle: assignment?.title ?? 'Chi tiết bài tập',
    pageDescription: 'Xem yêu cầu, nộp bài và theo dõi phản hồi trong cùng một luồng xử lý.',
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

  if (assignmentId && !canStudentViewAssignment(studentProfileMock.id, assignmentId)) {
    return {
      state: 'error',
      frame: baseFrame,
      errorMessage: 'Bạn không có quyền xem bài tập này.',
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

  return {
    state: state === 'empty' ? 'ready' : state,
    frame: baseFrame,
    assignment: {
      id: assignment.id,
      title: assignment.title,
      classLabel: getClassLabel(studentClass),
      deadlineLabel: formatPortalDateTime(assignment.dueAt),
      dueAt: assignment.dueAt,
      allowLateSubmission: assignment.allowLateSubmission,
      assignmentStatus: assignment.status,
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
      description: assignment.description,
      resourceLinks: assignment.resourceLinks,
      feedbackMessages: feedbackThread?.messages ?? [],
      resultSummary: result
        ? {
            totalScore: result.totalScore,
            maxScore: result.maxScore,
            lecturerFeedback: result.lecturerFeedback,
            updatedAtLabel: formatPortalDateTime(result.updatedAt),
            resultHref: buildStudentPortalHref('result-detail', { resultId: result.id }),
          }
        : undefined,
    },
  }
}
