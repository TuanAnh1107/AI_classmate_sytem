import type { DataState } from '../../models/shared/portal.types'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { adminUsersMock } from '../../models/admin/admin.data'
import { ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../../models/admin/admin.constants'
import { getAccountStatusLabel, getRoleLabel } from '../../models/admin/admin.mappers'
import { useAdminPortalShellController } from './useAdminPortalShellController'
import { useAdminQueryParams } from './useAdminQueryParams'
import { matchSearch, paginateRows } from './admin.utils'
import { formatPortalDateTime } from '../../models/student/student.mappers'

export type AdminUserRow = {
  id: string
  fullName: string
  email: string
  role: string
  roleLabel: string
  roleTone: 'admin' | 'lecturer' | 'student'
  status: string
  statusLabel: string
  statusTone: 'success' | 'warning' | 'danger'
  unitLabel: string
  lastLoginLabel: string
  detailHref: string
}

export type AdminUserDetail = {
  id: string
  title: string
  subtitle: string
  sections: { title: string; fields: { label: string; value: string }[] }[]
}

export type AdminUsersViewModel = {
  frame: AdminPageFrame
  state: DataState
  rows: AdminUserRow[]
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  filters: {
    search: string
    role: string
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
  detail?: AdminUserDetail
  errorMessage?: string
  setQuery: (next: Partial<ReturnType<typeof useAdminQueryParams>['query']>) => void
}

const sortOptions = [
  { value: 'recent', label: 'Mới cập nhật' },
  { value: 'name-asc', label: 'Tên A → Z' },
  { value: 'name-desc', label: 'Tên Z → A' },
  { value: 'id-asc', label: 'Mã tăng dần' },
  { value: 'id-desc', label: 'Mã giảm dần' },
]

export function useAdminUsersController(state: DataState): AdminUsersViewModel {
  const shell = useAdminPortalShellController('users')
  const { query, setQuery } = useAdminQueryParams()
  const sortValue = sortOptions.some((option) => option.value === query.sort) ? query.sort : 'recent'

  const frame: AdminPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [{ label: 'Trang chủ', href: '?portal=admin&page=dashboard' }, { label: 'Người dùng' }],
  }

  const filters = {
    search: query.search,
    role: query.role,
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
      errorMessage: 'Không thể tải danh sách người dùng.',
    }
  }

  const filtered = adminUsersMock
    .filter((user) => matchSearch(`${user.id} ${user.fullName} ${user.email}`, query.search))
    .filter((user) => (query.role === 'all' ? true : user.role === query.role))
    .filter((user) => (query.status === 'all' ? true : user.status === query.status))

  const sorted = [...filtered].sort((a, b) => {
    switch (sortValue) {
      case 'name-asc':
        return a.fullName.localeCompare(b.fullName)
      case 'name-desc':
        return b.fullName.localeCompare(a.fullName)
      case 'id-desc':
        return b.id.localeCompare(a.id)
      case 'id-asc':
        return a.id.localeCompare(b.id)
      default:
        return b.createdAt.localeCompare(a.createdAt)
    }
  })

  const { rows: pagedRows, total } = paginateRows(sorted, query.page, query.pageSize)

  const adminCount = adminUsersMock.filter((user) => user.role === 'admin').length
  const lecturerCount = adminUsersMock.filter((user) => user.role === 'lecturer').length
  const studentCount = adminUsersMock.filter((user) => user.role === 'student').length

  const stats = [
    { id: 'total', label: 'Tổng người dùng', value: String(adminUsersMock.length), tone: 'info' as const },
    { id: 'admins', label: 'Admin', value: String(adminCount), tone: 'neutral' as const },
    { id: 'lecturers', label: 'Giảng viên', value: String(lecturerCount), tone: 'warning' as const },
    { id: 'students', label: 'Sinh viên', value: String(studentCount), tone: 'success' as const },
  ]

  const rows: AdminUserRow[] = pagedRows.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    roleLabel: getRoleLabel(user.role),
    roleTone: user.role,
    status: user.status,
    statusLabel: getAccountStatusLabel(user.status),
    statusTone: user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger',
    unitLabel: user.unitLabel,
    lastLoginLabel: user.lastLoginAt ? formatPortalDateTime(user.lastLoginAt) : 'Chưa đăng nhập',
    detailHref: `?portal=admin&page=users&detailId=${user.id}`,
  }))

  const detailTarget = query.detailId
  const detailUser = detailTarget ? adminUsersMock.find((user) => user.id === detailTarget) : undefined
  const detail: AdminUserDetail | undefined = detailUser
    ? {
        id: detailUser.id,
        title: detailUser.fullName,
        subtitle: `${detailUser.email} · ${getRoleLabel(detailUser.role)}`,
        sections: [
          {
            title: 'Tài khoản',
            fields: [
              { label: 'Mã người dùng', value: detailUser.id },
              { label: 'Vai trò', value: getRoleLabel(detailUser.role) },
              { label: 'Trạng thái', value: getAccountStatusLabel(detailUser.status) },
              { label: 'Đơn vị', value: detailUser.unitLabel },
            ],
          },
          {
            title: 'Hoạt động',
            fields: [
              { label: 'Lần đăng nhập gần nhất', value: detailUser.lastLoginAt ? formatPortalDateTime(detailUser.lastLoginAt) : 'Chưa đăng nhập' },
              { label: 'Ngày tạo tài khoản', value: formatPortalDateTime(detailUser.createdAt) },
              { label: 'Lớp liên quan', value: detailUser.classIds.length ? detailUser.classIds.join(', ').toUpperCase() : '—' },
            ],
          },
        ],
      }
    : undefined

  if (!rows.length) {
    return {
      frame,
      state: 'empty',
      rows: [],
      stats,
      filters,
      pagination: { total, page: query.page, pageSize: query.pageSize },
      setQuery,
    }
  }

  return {
    frame,
    state,
    rows,
    stats,
    filters,
    pagination: { total, page: query.page, pageSize: query.pageSize },
    detail,
    errorMessage: undefined,
    setQuery,
  }
}

export const adminUserSortOptions = sortOptions
export const adminUserRoleOptions = ROLE_OPTIONS
export const adminUserStatusOptions = USER_STATUS_OPTIONS
