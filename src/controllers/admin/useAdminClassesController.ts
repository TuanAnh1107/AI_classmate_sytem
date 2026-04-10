import type { DataState } from '../../models/shared/portal.types'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { adminClassMetaMock } from '../../models/admin/admin.data'
import { CLASS_STATUS_OPTIONS } from '../../models/admin/admin.constants'
import { getClassStatusLabel } from '../../models/admin/admin.mappers'
import { dbAssignments, dbClasses, dbClassStudents, dbCourses, dbProfiles, dbSubmissions } from '../../models/db/modernDb.mock'
import { rbacUsersMock } from '../../models/rbac/rbac.mock'
import { useAdminPortalShellController } from './useAdminPortalShellController'
import { useAdminQueryParams } from './useAdminQueryParams'
import { matchSearch, paginateRows } from './admin.utils'

export type AdminClassRow = {
  id: string
  code: string
  name: string
  semester: string
  lecturerName: string
  studentCountLabel: string
  assignmentCountLabel: string
  submissionRateLabel: string
  status: string
  statusLabel: string
  detailHref: string
}

export type AdminClassDetail = {
  id: string
  title: string
  subtitle: string
  sections: { title: string; fields: { label: string; value: string }[] }[]
}

export type AdminClassesViewModel = {
  frame: AdminPageFrame
  state: DataState
  rows: AdminClassRow[]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  filters: {
    search: string
    semester: string
    status: string
    lecturerId: string
    sort: string
    page: number
    pageSize: number
  }
  pagination: {
    total: number
    page: number
    pageSize: number
  }
  detail?: AdminClassDetail
  errorMessage?: string
  setQuery: (next: Partial<ReturnType<typeof useAdminQueryParams>['query']>) => void
}

const sortOptions = [
  { value: 'recent', label: 'Cập nhật gần nhất' },
  { value: 'code-asc', label: 'Mã lớp A → Z' },
  { value: 'name-asc', label: 'Tên lớp A → Z' },
  { value: 'students-desc', label: 'Sĩ số giảm dần' },
]

const lecturerOptions = [
  { value: 'all', label: 'Tất cả giảng viên' },
  ...rbacUsersMock.filter((user) => user.role === 'lecturer').map((user) => ({ value: user.fullName, label: user.fullName })),
]

const lecturerById = new Map(dbProfiles.map((profile) => [profile.id, profile.full_name]))
const courseById = new Map(dbCourses.map((course) => [course.id, course]))

export function useAdminClassesController(state: DataState): AdminClassesViewModel {
  const shell = useAdminPortalShellController('classes')
  const { query, setQuery } = useAdminQueryParams()
  const sortValue = sortOptions.some((option) => option.value === query.sort) ? query.sort : 'recent'

  const frame: AdminPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [{ label: 'Trang chủ', href: '?portal=admin&page=dashboard' }, { label: 'Lớp học' }],
  }

  const filters = {
    search: query.search,
    semester: query.semester,
    status: query.status,
    lecturerId: query.lecturerId,
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
      errorMessage: 'Không thể tải danh sách lớp.',
    }
  }

  const rowsData = dbClasses.map((clazz) => {
    const lecturerName = lecturerById.get(clazz.lecturer_id) ?? clazz.lecturer_id
    const students = dbClassStudents.filter((item) => item.class_id === clazz.id)
    const assignments = dbAssignments.filter((assignment) => assignment.class_id === clazz.id)
    const submissions = dbSubmissions.filter((submission) => assignments.some((assignment) => assignment.id === submission.assignment_id))
    const totalSubmissions = students.length * Math.max(assignments.length, 1)
    const submissionRate = totalSubmissions === 0 ? 0 : Math.round((submissions.length / totalSubmissions) * 100)
    const meta = adminClassMetaMock.find((item) => item.id === clazz.id)
    const course = courseById.get(clazz.course_id)

    return {
      id: clazz.id,
      code: clazz.id.toUpperCase(),
      name: course?.name ?? 'Lớp học',
      semester: meta?.semester ?? clazz.semester,
      lecturerName,
      studentCountLabel: `${students.length} sinh viên`,
      assignmentCountLabel: `${assignments.length} bài`,
      submissionRateLabel: `${submissionRate}%`,
      status: meta?.status ?? 'active',
      statusLabel: getClassStatusLabel(meta?.status ?? 'active'),
      detailHref: `?portal=admin&page=classes&detailId=${clazz.id}`,
    }
  })

  const filtered = rowsData
    .filter((row) => matchSearch(`${row.code} ${row.name} ${row.lecturerName}`, query.search))
    .filter((row) => (query.semester === 'all' ? true : row.semester === query.semester))
    .filter((row) => (query.status === 'all' ? true : row.status === query.status))
    .filter((row) => (query.lecturerId === 'all' ? true : row.lecturerName.includes(query.lecturerId)))

  const sorted = [...filtered].sort((a, b) => {
    switch (sortValue) {
      case 'code-asc':
        return a.code.localeCompare(b.code)
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'students-desc':
        return Number(b.studentCountLabel.split(' ')[0]) - Number(a.studentCountLabel.split(' ')[0])
      default:
        return 0
    }
  })

  const { rows: pagedRows, total } = paginateRows(sorted, query.page, query.pageSize)

  const stats = [
    { id: 'total', label: 'Tổng số lớp', value: String(dbClasses.length), tone: 'info' as const },
    { id: 'active', label: 'Lớp đang hoạt động', value: String(dbClasses.length), tone: 'success' as const },
    { id: 'lecturers', label: 'Giảng viên phụ trách', value: String(lecturerOptions.length - 1), tone: 'neutral' as const },
    { id: 'students', label: 'Tổng sinh viên', value: String(dbClassStudents.length), tone: 'warning' as const },
  ]

  const detailTarget = query.detailId
  const detailRow = detailTarget ? rowsData.find((row) => row.id === detailTarget) : undefined
  const detail: AdminClassDetail | undefined = detailRow
    ? {
        id: detailRow.id,
        title: `${detailRow.code} · ${detailRow.name}`,
        subtitle: `Học kỳ ${detailRow.semester} · ${detailRow.lecturerName}`,
        sections: [
          {
            title: 'Tổng quan lớp',
            fields: [
              { label: 'Sĩ số', value: detailRow.studentCountLabel },
              { label: 'Bài tập', value: detailRow.assignmentCountLabel },
              { label: 'Tỷ lệ nộp', value: detailRow.submissionRateLabel },
              { label: 'Trạng thái', value: detailRow.statusLabel },
            ],
          },
          {
            title: 'Điều phối',
            fields: [
              { label: 'Giảng viên phụ trách', value: detailRow.lecturerName },
              { label: 'Khoa/Viện', value: adminClassMetaMock.find((item) => item.id === detailRow.id)?.faculty ?? 'Viện CNTT' },
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

export const adminClassSortOptions = sortOptions
export const adminClassStatusOptions = CLASS_STATUS_OPTIONS
export const adminClassLecturerOptions = lecturerOptions
