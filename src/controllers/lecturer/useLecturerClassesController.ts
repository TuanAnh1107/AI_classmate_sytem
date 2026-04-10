import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { getClassStudents, getLecturerClasses } from '../../models/rbac/rbac.mappers'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { useLecturerQueryParams } from './useLecturerQueryParams'
import { getCoverageLabel, getCoverageTone, getDeadlineState, matchSearch, paginateRows } from './lecturer.utils'

export type LecturerClassRow = {
  id: string
  code: string
  name: string
  semester: string
  studentCount: number
  studentCountLabel: string
  openAssignmentsCount: number
  openAssignmentsLabel: string
  pendingGradeCount: number
  pendingGradeLabel: string
  overdueAssignmentsCount: number
  overdueAssignmentsLabel: string
  coverageLabel: string
  coverageTone: 'success' | 'info' | 'warning'
  attentionLabel: string
  attentionTone: 'success' | 'warning'
  href: string
}

export type LecturerClassesViewModel = {
  frame: LecturerPageFrame
  state: DataState
  rows: LecturerClassRow[]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  filters: {
    search: string
    semester: string
    status: string
    sort: string
    page: number
    pageSize: number
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
  { value: 'attention', label: 'Cần chú ý' },
  { value: 'students-desc', label: 'Sĩ số giảm dần' },
  { value: 'assignments-desc', label: 'Assignment đang mở' },
  { value: 'pending-desc', label: 'Chưa chấm nhiều' },
]

export function useLecturerClassesController(state: DataState): LecturerClassesViewModel {
  const shell = useLecturerPortalShellController('classes')
  const { query, setQuery } = useLecturerQueryParams()
  const sortValue = sortOptions.some((option) => option.value === query.sort) ? query.sort : 'attention'

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [
      { label: 'Trang chủ', href: '?portal=lecturer&page=dashboard' },
      { label: 'Lớp phụ trách' },
    ],
  }

  const baseFilters = {
    search: query.search,
    semester: query.semester,
    status: query.status,
    sort: sortValue,
    page: query.page,
    pageSize: query.pageSize,
  }

  if (state === 'loading') {
    return {
      frame,
      state,
      rows: [],
      stats: [],
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
      filters: baseFilters,
      pagination: { total: 0, page: query.page, pageSize: query.pageSize },
      setQuery,
      errorMessage: 'Không thể tải danh sách lớp.',
    }
  }

  const classes = getLecturerClasses(lecturerProfileMock.lecturerCode)
  const rowsData: LecturerClassRow[] = classes.map((clazz) => {
    const students = getClassStudents(clazz.id)
    const assignments = assignmentsMock.filter((assignment) => assignment.classId === clazz.id)
    const openAssignments = assignments.filter((assignment) => assignment.status === 'published')
    const overdueAssignments = assignments.filter((assignment) => getDeadlineState(assignment.dueAt).tone === 'danger')
    const submissions = submissionsMock.filter((submission) => assignments.some((assignment) => assignment.id === submission.assignmentId))
    const pending = submissions.filter((submission) => submission.score === undefined).length
    const coverageRate = students.length === 0 ? 0 : Math.round((submissions.length / students.length) * 100)
    const needsAttention = pending > 0 || coverageRate < 60 || overdueAssignments.length > 0

    return {
      id: clazz.id,
      code: clazz.code,
      name: clazz.name,
      semester: '2026-1',
      studentCount: students.length,
      studentCountLabel: `${students.length} sinh viên`,
      openAssignmentsCount: openAssignments.length,
      openAssignmentsLabel: `${openAssignments.length} bài`,
      pendingGradeCount: pending,
      pendingGradeLabel: `${pending} chưa chấm`,
      overdueAssignmentsCount: overdueAssignments.length,
      overdueAssignmentsLabel: `${overdueAssignments.length} quá hạn`,
      coverageLabel: getCoverageLabel(submissions.length, students.length),
      coverageTone: getCoverageTone(coverageRate),
      attentionLabel: needsAttention ? 'Cần chú ý' : 'Ổn định',
      attentionTone: needsAttention ? 'warning' : 'success',
      href: `?portal=lecturer&page=class-detail&classId=${clazz.id}`,
    }
  })

  const filtered = rowsData
    .filter((row) => matchSearch(`${row.code} ${row.name}`, query.search))
    .filter((row) => (query.semester === 'all' ? true : row.semester === query.semester))
    .filter((row) => {
      if (query.status === 'all') return true
      if (query.status === 'attention') return row.attentionTone === 'warning'
      return row.attentionTone === 'success'
    })

  const sorted = [...filtered].sort((a, b) => {
    switch (sortValue) {
      case 'students-desc':
        return b.studentCount - a.studentCount
      case 'assignments-desc':
        return b.openAssignmentsCount - a.openAssignmentsCount
      case 'pending-desc':
        return b.pendingGradeCount - a.pendingGradeCount
      default:
        return a.attentionLabel.localeCompare(b.attentionLabel)
    }
  })

  const { rows: pagedRows, total } = paginateRows(sorted, query.page, query.pageSize)

  const stats = [
    { id: 'total', label: 'Tổng lớp', value: String(rowsData.length), tone: 'info' as const },
    { id: 'students', label: 'Tổng sinh viên', value: String(rowsData.reduce((sum, row) => sum + row.studentCount, 0)), tone: 'success' as const },
    { id: 'open', label: 'Assignment đang mở', value: String(rowsData.reduce((sum, row) => sum + row.openAssignmentsCount, 0)), tone: 'warning' as const },
    { id: 'pending', label: 'Chưa chấm', value: String(rowsData.reduce((sum, row) => sum + row.pendingGradeCount, 0)), tone: 'warning' as const },
    { id: 'overdue', label: 'Assignment quá hạn', value: String(rowsData.reduce((sum, row) => sum + row.overdueAssignmentsCount, 0)), tone: 'warning' as const },
  ]

  if (!pagedRows.length) {
    return {
      frame,
      state: 'empty',
      rows: [],
      stats,
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
    filters: baseFilters,
    pagination: { total, page: query.page, pageSize: query.pageSize },
    setQuery,
  }
}

export const lecturerClassSortOptions = sortOptions
