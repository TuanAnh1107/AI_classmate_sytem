import type { DataState } from '../../models/shared/portal.types'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { GRADING_STATUS_OPTIONS, SUBMISSION_STATUS_OPTIONS } from '../../models/admin/admin.constants'
import { getGradingStatusLabel, getSubmissionStatusLabel } from '../../models/admin/admin.mappers'
import { dbAssignments, dbClasses, dbGrades, dbProfiles, dbSubmissions } from '../../models/db/modernDb.mock'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { useAdminPortalShellController } from './useAdminPortalShellController'
import { useAdminQueryParams } from './useAdminQueryParams'
import { matchSearch, paginateRows } from './admin.utils'

export type AdminSubmissionRow = {
  id: string
  assignmentId: string
  assignmentTitle: string
  classLabel: string
  lecturerName: string
  studentId: string
  studentName: string
  submissionStatus: 'submitted' | 'late' | 'draft' | 'missing'
  submissionStatusLabel: string
  gradingStatus: 'graded' | 'ungraded' | 'pending'
  gradingStatusLabel: string
  submittedAt: string
  submittedAtLabel: string
  scoreLabel: string
  detailHref: string
}

export type AdminSubmissionDetail = {
  id: string
  title: string
  subtitle: string
  sections: { title: string; fields: { label: string; value: string }[] }[]
}

export type AdminSubmissionsViewModel = {
  frame: AdminPageFrame
  state: DataState
  rows: AdminSubmissionRow[]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  filters: {
    search: string
    classId: string
    lecturerId: string
    assignmentId: string
    submissionStatus: string
    gradingStatus: string
    scoreMin: string
    scoreMax: string
    dateFrom: string
    dateTo: string
    sort: string
    page: number
    pageSize: number
  }
  pagination: {
    total: number
    page: number
    pageSize: number
  }
  detail?: AdminSubmissionDetail
  errorMessage?: string
  setQuery: (next: Partial<ReturnType<typeof useAdminQueryParams>['query']>) => void
}

const sortOptions = [
  { value: 'submitted-desc', label: 'Mới nộp' },
  { value: 'submitted-asc', label: 'Nộp sớm' },
  { value: 'score-desc', label: 'Điểm cao' },
  { value: 'score-asc', label: 'Điểm thấp' },
]

const classOptions = [
  { value: 'all', label: 'Tất cả lớp' },
  ...dbClasses.map((clazz) => ({ value: clazz.id, label: clazz.id.toUpperCase() })),
]

const lecturerOptions = [
  { value: 'all', label: 'Tất cả giảng viên' },
  ...dbProfiles
    .filter((profile) => profile.id.startsWith('lect-'))
    .map((profile) => ({ value: profile.id, label: profile.full_name })),
]

const assignmentOptions = [
  { value: 'all', label: 'Tất cả bài tập' },
  ...dbAssignments.map((assignment) => ({ value: assignment.id, label: assignment.title })),
]

const assignmentById = new Map(dbAssignments.map((assignment) => [assignment.id, assignment]))
const lecturerById = new Map(dbProfiles.map((profile) => [profile.id, profile.full_name]))
const studentById = new Map(dbProfiles.map((profile) => [profile.id, profile.full_name]))

export function useAdminSubmissionsController(state: DataState): AdminSubmissionsViewModel {
  const shell = useAdminPortalShellController('submissions')
  const { query, setQuery } = useAdminQueryParams()
  const sortValue = sortOptions.some((option) => option.value === query.sort) ? query.sort : 'submitted-desc'

  const frame: AdminPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [{ label: 'Trang chủ', href: '?portal=admin&page=dashboard' }, { label: 'Bài nộp' }],
  }

  const filters = {
    search: query.search,
    classId: query.classId,
    lecturerId: query.lecturerId,
    assignmentId: query.assignmentId,
    submissionStatus: query.submissionStatus,
    gradingStatus: query.gradingStatus,
    scoreMin: query.scoreMin,
    scoreMax: query.scoreMax,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
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
      filters,
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
      filters,
      pagination: { total: 0, page: query.page, pageSize: query.pageSize },
      setQuery,
      errorMessage: 'Không thể tải danh sách bài nộp.',
    }
  }

  const rowsData: AdminSubmissionRow[] = dbSubmissions.map((submission) => {
    const assignment = assignmentById.get(submission.assignment_id)
    const lecturerName = assignment ? lecturerById.get(assignment.created_by) : undefined
    const studentName = studentById.get(submission.student_id) ?? submission.student_id
    const grade = dbGrades.find((item) => item.submission_id === submission.id)
    const submissionStatus = resolveSubmissionStatus(submission.submitted_at, assignment?.deadline)
    const gradingStatus = grade ? 'graded' : 'ungraded'

    return {
      id: submission.id,
      assignmentId: submission.assignment_id,
      assignmentTitle: assignment?.title ?? 'Bài tập',
      classLabel: submission.class_id.toUpperCase(),
      lecturerName: lecturerName ?? '—',
      studentId: submission.student_id,
      studentName,
      submissionStatus,
      submissionStatusLabel: getSubmissionStatusLabel(submissionStatus),
      gradingStatus,
      gradingStatusLabel: getGradingStatusLabel(gradingStatus),
      submittedAt: submission.submitted_at,
      submittedAtLabel: formatPortalDateTime(submission.submitted_at),
      scoreLabel: grade ? String(grade.total_score) : '—',
      detailHref: `?portal=admin&page=submissions&detailId=${submission.id}`,
    }
  })

  const filtered = rowsData
    .filter((row) => matchSearch(`${row.studentId} ${row.studentName} ${row.assignmentTitle}`, query.search))
    .filter((row) => (query.classId === 'all' ? true : row.classLabel.toLowerCase().includes(query.classId)))
    .filter((row) => (query.lecturerId === 'all' ? true : row.lecturerName.includes(query.lecturerId)))
    .filter((row) => (query.assignmentId === 'all' ? true : row.assignmentId === query.assignmentId))
    .filter((row) => (query.submissionStatus === 'all' ? true : row.submissionStatus === query.submissionStatus))
    .filter((row) => (query.gradingStatus === 'all' ? true : row.gradingStatus === query.gradingStatus))
    .filter((row) => {
      const min = Number(query.scoreMin)
      const max = Number(query.scoreMax)
      if (Number.isNaN(min) && Number.isNaN(max)) return true
      const score = Number(row.scoreLabel)
      if (Number.isNaN(score)) return false
      if (!Number.isNaN(min) && score < min) return false
      if (!Number.isNaN(max) && score > max) return false
      return true
    })
    .filter((row) => (query.dateFrom ? row.submittedAt >= query.dateFrom : true))
    .filter((row) => (query.dateTo ? row.submittedAt <= query.dateTo : true))

  const sorted = [...filtered].sort((a, b) => {
    switch (sortValue) {
      case 'submitted-asc':
        return a.submittedAt.localeCompare(b.submittedAt)
      case 'score-desc':
        return Number(b.scoreLabel === '—' ? -1 : b.scoreLabel) - Number(a.scoreLabel === '—' ? -1 : a.scoreLabel)
      case 'score-asc':
        return Number(a.scoreLabel === '—' ? 999 : a.scoreLabel) - Number(b.scoreLabel === '—' ? 999 : b.scoreLabel)
      default:
        return b.submittedAt.localeCompare(a.submittedAt)
    }
  })

  const { rows: pagedRows, total } = paginateRows(sorted, query.page, query.pageSize)

  const stats = [
    { id: 'total', label: 'Tổng submissions', value: String(rowsData.length), tone: 'info' as const },
    { id: 'submitted', label: 'Đã nộp', value: String(rowsData.length), tone: 'success' as const },
    { id: 'late', label: 'Nộp trễ', value: String(rowsData.filter((row) => row.submissionStatus === 'late').length), tone: 'warning' as const },
    { id: 'ungraded', label: 'Chưa chấm', value: String(rowsData.filter((row) => row.gradingStatus === 'ungraded').length), tone: 'warning' as const },
    { id: 'graded', label: 'Đã chấm', value: String(rowsData.filter((row) => row.gradingStatus === 'graded').length), tone: 'success' as const },
  ]

  const detailTarget = query.detailId
  const detailRow = detailTarget ? rowsData.find((row) => row.id === detailTarget) : undefined
  const detail: AdminSubmissionDetail | undefined = detailRow
    ? {
        id: detailRow.id,
        title: detailRow.assignmentTitle,
        subtitle: `${detailRow.studentName} · ${detailRow.classLabel}`,
        sections: [
          {
            title: 'Nộp bài',
            fields: [
              { label: 'Trạng thái nộp', value: detailRow.submissionStatusLabel },
              { label: 'Chấm điểm', value: detailRow.gradingStatusLabel },
              { label: 'Thời điểm nộp', value: detailRow.submittedAtLabel },
              { label: 'Điểm', value: detailRow.scoreLabel },
            ],
          },
        ],
      }
    : undefined

  if (!pagedRows.length) {
    return {
      frame,
      state: 'empty',
      rows: [],
      stats,
      filters,
      pagination: { total, page: query.page, pageSize: query.pageSize },
      detail,
      setQuery,
    }
  }

  return {
    frame,
    state,
    rows: pagedRows,
    stats,
    filters,
    pagination: { total, page: query.page, pageSize: query.pageSize },
    detail,
    setQuery,
  }
}

export const adminSubmissionSortOptions = sortOptions
export const adminSubmissionClassOptions = classOptions
export const adminSubmissionLecturerOptions = lecturerOptions
export const adminSubmissionAssignmentOptions = assignmentOptions
export const adminSubmissionStatusOptions = SUBMISSION_STATUS_OPTIONS
export const adminGradingStatusOptions = GRADING_STATUS_OPTIONS

function resolveSubmissionStatus(submittedAt: string, deadline?: string): 'submitted' | 'late' | 'draft' | 'missing' {
  if (!deadline) return 'submitted'
  const submitted = new Date(submittedAt).getTime()
  const due = new Date(deadline).getTime()
  if (Number.isNaN(submitted) || Number.isNaN(due)) return 'submitted'
  return submitted > due ? 'late' : 'submitted'
}
