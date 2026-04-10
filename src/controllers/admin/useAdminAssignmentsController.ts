import type { DataState } from '../../models/shared/portal.types'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { ASSIGNMENT_STATUS_OPTIONS } from '../../models/admin/admin.constants'
import { getAssignmentStatusLabel } from '../../models/admin/admin.mappers'
import { dbAssignments, dbClasses, dbClassStudents, dbCourses, dbGrades, dbProfiles, dbSubmissions } from '../../models/db/modernDb.mock'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { useAdminPortalShellController } from './useAdminPortalShellController'
import { useAdminQueryParams } from './useAdminQueryParams'
import { matchSearch, paginateRows } from './admin.utils'

export type AdminAssignmentRow = {
  id: string
  title: string
  classId: string
  classLabel: string
  lecturerName: string
  dueAt: string
  dueAtLabel: string
  status: 'draft' | 'open' | 'closed' | 'overdue'
  statusLabel: string
  studentCountLabel: string
  submissionsLabel: string
  submissionRateLabel: string
  pendingGradingCount: number
  detailHref: string
}

export type AdminAssignmentDetail = {
  id: string
  title: string
  subtitle: string
  sections: { title: string; fields: { label: string; value: string }[] }[]
}

export type AdminAssignmentsViewModel = {
  frame: AdminPageFrame
  state: DataState
  rows: AdminAssignmentRow[]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  filters: {
    search: string
    classId: string
    lecturerId: string
    status: string
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
  detail?: AdminAssignmentDetail
  errorMessage?: string
  setQuery: (next: Partial<ReturnType<typeof useAdminQueryParams>['query']>) => void
}

const sortOptions = [
  { value: 'deadline', label: 'Deadline gần nhất' },
  { value: 'created', label: 'Tạo gần đây' },
  { value: 'coverage', label: 'Tỷ lệ nộp thấp' },
  { value: 'pending', label: 'Chưa chấm nhiều' },
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

const courseById = new Map(dbCourses.map((course) => [course.id, course]))
const classById = new Map(dbClasses.map((clazz) => [clazz.id, clazz]))
const lecturerById = new Map(dbProfiles.map((profile) => [profile.id, profile.full_name]))
const submissionsByAssignment = new Map<string, typeof dbSubmissions>()

dbAssignments.forEach((assignment) => {
  const submissions = dbSubmissions.filter((item) => item.assignment_id === assignment.id)
  submissionsByAssignment.set(assignment.id, submissions)
})

export function useAdminAssignmentsController(state: DataState): AdminAssignmentsViewModel {
  const shell = useAdminPortalShellController('assignments')
  const { query, setQuery } = useAdminQueryParams()
  const sortValue = sortOptions.some((option) => option.value === query.sort) ? query.sort : 'deadline'

  const frame: AdminPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [{ label: 'Trang chủ', href: '?portal=admin&page=dashboard' }, { label: 'Bài tập' }],
  }

  const filters = {
    search: query.search,
    classId: query.classId,
    lecturerId: query.lecturerId,
    status: query.status,
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
      errorMessage: 'Không thể tải danh sách bài tập.',
    }
  }

  const rowsData: AdminAssignmentRow[] = dbAssignments.map((assignment) => {
    const clazz = classById.get(assignment.class_id)
    const course = clazz ? courseById.get(clazz.course_id) : undefined
    const lecturerName = lecturerById.get(assignment.created_by) ?? assignment.created_by
    const students = dbClassStudents.filter((item) => item.class_id === assignment.class_id)
    const submissions = submissionsByAssignment.get(assignment.id) ?? []
    const pendingGradeCount = submissions.filter((submission) => !dbGrades.some((grade) => grade.submission_id === submission.id)).length
    const rate = students.length === 0 ? 0 : Math.round((submissions.length / students.length) * 100)
    const status = resolveAssignmentStatus(assignment.deadline)

    return {
      id: assignment.id,
      title: assignment.title,
      classId: assignment.class_id,
      classLabel: course?.name ? `${clazz?.id.toUpperCase()} · ${course.name}` : clazz?.id.toUpperCase() ?? assignment.class_id,
      lecturerName,
      dueAt: assignment.deadline,
      dueAtLabel: formatPortalDateTime(assignment.deadline),
      status,
      statusLabel: getAssignmentStatusLabel(status),
      studentCountLabel: `${students.length}`,
      submissionsLabel: `${submissions.length}`,
      submissionRateLabel: `${rate}%`,
      pendingGradingCount: pendingGradeCount,
      detailHref: `?portal=admin&page=assignments&detailId=${assignment.id}`,
    }
  })

  const filtered = rowsData
    .filter((row) => matchSearch(`${row.id} ${row.title} ${row.classLabel}`, query.search))
    .filter((row) => (query.classId === 'all' ? true : row.classId === query.classId))
    .filter((row) => (query.lecturerId === 'all' ? true : row.lecturerName.includes(query.lecturerId)))
    .filter((row) => (query.status === 'all' ? true : row.status === query.status))
    .filter((row) => (query.dateFrom ? row.dueAt >= query.dateFrom : true))
    .filter((row) => (query.dateTo ? row.dueAt <= query.dateTo : true))

  const sorted = [...filtered].sort((a, b) => {
    switch (sortValue) {
      case 'coverage':
        return a.submissionRateLabel.localeCompare(b.submissionRateLabel)
      case 'pending':
        return b.pendingGradingCount - a.pendingGradingCount
      case 'created':
        return b.id.localeCompare(a.id)
      default:
        return a.dueAt.localeCompare(b.dueAt)
    }
  })

  const { rows: pagedRows, total } = paginateRows(sorted, query.page, query.pageSize)

  const stats = [
    { id: 'total', label: 'Tổng bài tập', value: String(rowsData.length), tone: 'info' as const },
    { id: 'open', label: 'Đang mở', value: String(rowsData.filter((row) => row.status === 'open').length), tone: 'success' as const },
    { id: 'closed', label: 'Đã đóng', value: String(rowsData.filter((row) => row.status === 'closed').length), tone: 'neutral' as const },
    { id: 'overdue', label: 'Quá hạn', value: String(rowsData.filter((row) => row.status === 'overdue').length), tone: 'warning' as const },
    {
      id: 'lowCoverage',
      label: 'Tỷ lệ nộp thấp',
      value: String(rowsData.filter((row) => Number(row.submissionRateLabel.replace('%', '')) < 60).length),
      tone: 'warning' as const,
    },
  ]

  const detailTarget = query.detailId
  const detailRow = detailTarget ? rowsData.find((row) => row.id === detailTarget) : undefined
  const detail: AdminAssignmentDetail | undefined = detailRow
    ? {
        id: detailRow.id,
        title: detailRow.title,
        subtitle: `${detailRow.classLabel} · ${detailRow.lecturerName}`,
        sections: [
          {
            title: 'Tổng quan',
            fields: [
              { label: 'Deadline', value: detailRow.dueAtLabel },
              { label: 'Trạng thái', value: detailRow.statusLabel },
              { label: 'Tỷ lệ nộp', value: detailRow.submissionRateLabel },
              { label: 'Chưa chấm', value: String(detailRow.pendingGradingCount) },
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

export const adminAssignmentSortOptions = sortOptions
export const adminAssignmentClassOptions = classOptions
export const adminAssignmentLecturerOptions = lecturerOptions
export const adminAssignmentStatusOptions = ASSIGNMENT_STATUS_OPTIONS

function resolveAssignmentStatus(deadline: string): 'draft' | 'open' | 'closed' | 'overdue' {
  const now = Date.now()
  const dueAt = new Date(deadline).getTime()
  if (Number.isNaN(dueAt)) {
    return 'draft'
  }
  if (dueAt < now) {
    return 'overdue'
  }
  return 'open'
}
