import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { getClassStudents, getLecturerClasses } from '../../models/rbac/rbac.mappers'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { useLecturerQueryParams } from './useLecturerQueryParams'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { matchSearch, paginateRows } from './lecturer.utils'

export type LecturerSubmissionRow = {
  id: string
  assignmentTitle: string
  classLabel: string
  studentName: string
  studentCode: string
  submissionStatus: 'submitted' | 'late' | 'missing'
  submissionLabel: string
  gradingStatus: 'graded' | 'ungraded'
  gradingLabel: string
  submittedAtLabel: string
  attemptsLabel: string
  scoreLabel: string
  feedbackLabel: string
  href: string
}

export type LecturerSubmissionTab = {
  id: string
  label: string
  count: number
}

export type LecturerSubmissionListViewModel = {
  frame: LecturerPageFrame
  state: DataState
  rows: LecturerSubmissionRow[]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  tabs: LecturerSubmissionTab[]
  classOptions: { value: string; label: string }[]
  assignmentOptions: { value: string; label: string }[]
  filters: {
    search: string
    submissionStatus: string
    gradingStatus: string
    classId: string
    assignmentId: string
    sort: string
    page: number
    pageSize: number
    view: string
  }
  pagination: {
    total: number
    page: number
    pageSize: number
  }
  errorMessage?: string
  setQuery: (next: Partial<ReturnType<typeof useLecturerQueryParams>['query']>) => void
}

const sortOptions = [
  { value: 'submittedAt', label: 'Nộp gần nhất' },
  { value: 'score', label: 'Điểm cao' },
  { value: 'status', label: 'Trạng thái' },
]

export function useLecturerSubmissionListController(
  assignmentId: string | undefined,
  state: DataState,
): LecturerSubmissionListViewModel {
  const shell = useLecturerPortalShellController('submission-list')
  const { query, setQuery } = useLecturerQueryParams()
  const sortValue = sortOptions.some((option) => option.value === query.sort) ? query.sort : 'submittedAt'

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [
      { label: 'Trang chủ', href: '?portal=lecturer&page=dashboard' },
      { label: 'Bài nộp' },
    ],
  }

  const baseFilters = {
    search: query.search,
    submissionStatus: query.submissionStatus,
    gradingStatus: query.gradingStatus,
    classId: query.classId,
    assignmentId: assignmentId ?? query.assignmentId,
    sort: sortValue,
    page: query.page,
    pageSize: query.pageSize,
    view: query.view,
  }

  if (state === 'loading') {
    return {
      frame,
      state,
      rows: [],
      stats: [],
      tabs: [],
      classOptions: [],
      assignmentOptions: [],
      filters: baseFilters,
      pagination: { total: 0, page: query.page, pageSize: query.pageSize },
      setQuery,
    }
  }

  if (state === 'error') {
    return {
      frame,
      state,
      rows: [],
      stats: [],
      tabs: [],
      classOptions: [],
      assignmentOptions: [],
      filters: baseFilters,
      pagination: { total: 0, page: query.page, pageSize: query.pageSize },
      setQuery,
      errorMessage: 'Không thể tải danh sách bài nộp.',
    }
  }

  const classes = getLecturerClasses(lecturerProfileMock.lecturerCode)
  const lecturerAssignments = assignmentsMock.filter((assignment) => assignment.createdBy === lecturerProfileMock.lecturerCode)
  const classOptions = [{ value: 'all', label: 'Tất cả lớp' }].concat(
    classes.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` })),
  )
  const assignmentScope = lecturerAssignments.filter((assignment) => {
    if (assignmentId) return assignment.id === assignmentId
    if (query.assignmentId && query.assignmentId !== 'all') return assignment.id === query.assignmentId
    if (query.classId && query.classId !== 'all') return assignment.classId === query.classId
    return true
  })
  const assignmentOptions = [{ value: 'all', label: 'Tất cả bài tập' }].concat(
    lecturerAssignments
      .filter((assignment) => (query.classId !== 'all' ? assignment.classId === query.classId : true))
      .map((assignment) => ({ value: assignment.id, label: assignment.title })),
  )

  const rowsData: LecturerSubmissionRow[] = []
  assignmentScope.forEach((assignment) => {
    const students = getClassStudents(assignment.classId)
    students.forEach((student) => {
      const submissions = submissionsMock.filter(
        (submission) => submission.assignmentId === assignment.id && submission.studentId === student.id,
      )
      const latest = submissions.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))[0]

      if (!latest) {
        rowsData.push({
          id: `missing-${assignment.id}-${student.id}`,
          assignmentTitle: assignment.title,
          classLabel: assignment.classId.toUpperCase(),
          studentName: student.fullName,
          studentCode: student.id,
          submissionStatus: 'missing',
          submissionLabel: 'Chưa nộp',
          gradingStatus: 'ungraded',
          gradingLabel: 'Chưa chấm',
          submittedAtLabel: 'Chưa nộp',
          attemptsLabel: '0',
          scoreLabel: '--',
          feedbackLabel: 'Chưa có',
          href: `?portal=lecturer&page=assignment-detail&assignmentId=${assignment.id}`,
        })
        return
      }

      const isLate = latest.status === 'late'
      const isGraded = latest.score !== undefined
      rowsData.push({
        id: latest.id,
        assignmentTitle: assignment.title,
        classLabel: assignment.classId.toUpperCase(),
        studentName: student.fullName,
        studentCode: student.id,
        submissionStatus: isLate ? 'late' : 'submitted',
        submissionLabel: isLate ? 'Nộp trễ' : 'Đã nộp',
        gradingStatus: isGraded ? 'graded' : 'ungraded',
        gradingLabel: isGraded ? 'Đã chấm' : 'Chưa chấm',
        submittedAtLabel: latest.submittedAt ? formatPortalDateTime(latest.submittedAt) : 'Chưa nộp',
        attemptsLabel: `${submissions.length}`,
        scoreLabel: latest.score !== undefined ? latest.score.toFixed(1) : '--',
        feedbackLabel: latest.feedback ? 'Đã phản hồi' : 'Chưa phản hồi',
        href: `?portal=lecturer&page=submission-detail&submissionId=${latest.id}`,
      })
    })
  })

  const counts = {
    total: rowsData.length,
    ungraded: rowsData.filter((row) => row.gradingStatus === 'ungraded' && row.submissionStatus !== 'missing').length,
    late: rowsData.filter((row) => row.submissionStatus === 'late').length,
    missing: rowsData.filter((row) => row.submissionStatus === 'missing').length,
    resubmitted: rowsData.filter((row) => Number(row.attemptsLabel) > 1).length,
    feedback: rowsData.filter((row) => row.submissionStatus !== 'missing' && row.feedbackLabel === 'Chưa phản hồi').length,
  }

  const tabs: LecturerSubmissionTab[] = [
    { id: 'all', label: 'Tất cả', count: rowsData.length },
    { id: 'ungraded', label: 'Chưa chấm', count: counts.ungraded },
    { id: 'late', label: 'Nộp trễ', count: counts.late },
    { id: 'missing', label: 'Chưa nộp', count: counts.missing },
    { id: 'resubmitted', label: 'Nộp lại', count: counts.resubmitted },
    { id: 'needs-feedback', label: 'Cần phản hồi', count: counts.feedback },
  ]

  const viewFiltered = rowsData.filter((row) => {
    switch (query.view) {
      case 'ungraded':
        return row.gradingStatus === 'ungraded' && row.submissionStatus !== 'missing'
      case 'late':
        return row.submissionStatus === 'late'
      case 'missing':
        return row.submissionStatus === 'missing'
      case 'resubmitted':
        return Number(row.attemptsLabel) > 1
      case 'needs-feedback':
        return row.feedbackLabel === 'Chưa phản hồi' && row.submissionStatus !== 'missing'
      default:
        return true
    }
  })

  const filtered = viewFiltered
    .filter((row) => matchSearch(`${row.assignmentTitle} ${row.studentName} ${row.studentCode}`, query.search))
    .filter((row) => (query.submissionStatus === 'all' ? true : row.submissionStatus === query.submissionStatus))
    .filter((row) => (query.gradingStatus === 'all' ? true : row.gradingStatus === query.gradingStatus))

  const sorted = [...filtered].sort((a, b) => {
    switch (sortValue) {
      case 'score':
        return Number(b.scoreLabel) - Number(a.scoreLabel)
      case 'status':
        return a.submissionLabel.localeCompare(b.submissionLabel)
      default:
        return b.submittedAtLabel.localeCompare(a.submittedAtLabel)
    }
  })

  const { rows: pagedRows, total } = paginateRows(sorted, query.page, query.pageSize)

  const stats = [
    { id: 'total', label: 'Tổng bài nộp', value: String(rowsData.length), tone: 'info' as const },
    { id: 'missing', label: 'Chưa nộp', value: String(counts.missing), tone: 'warning' as const },
    { id: 'submitted', label: 'Đã nộp', value: String(rowsData.length - counts.missing), tone: 'success' as const },
    { id: 'late', label: 'Nộp trễ', value: String(counts.late), tone: 'warning' as const },
    { id: 'ungraded', label: 'Chưa chấm', value: String(counts.ungraded), tone: 'warning' as const },
    { id: 'graded', label: 'Đã chấm', value: String(rowsData.filter((row) => row.gradingStatus === 'graded').length), tone: 'success' as const },
  ]

  if (!pagedRows.length) {
    return {
      frame,
      state: 'empty',
      rows: [],
      stats,
      tabs,
      classOptions,
      assignmentOptions,
      filters: baseFilters,
      pagination: { total, page: query.page, pageSize: query.pageSize },
      setQuery,
    }
  }

  return {
    frame,
    state,
    rows: pagedRows,
    stats,
    tabs,
    classOptions,
    assignmentOptions,
    filters: baseFilters,
    pagination: { total, page: query.page, pageSize: query.pageSize },
    setQuery,
  }
}

export const lecturerSubmissionSortOptions = sortOptions
