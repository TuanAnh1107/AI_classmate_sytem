import type { AdminPageKey } from './admin.types'
import type { HeaderUserMenuModel, PortalNavItem, UtilityBarModel } from '../shared/portal.types'
import { adminProfileMock } from './admin.mock'

export function buildAdminNavItems(activePage: AdminPageKey, unreadCount = 0): PortalNavItem[] {
  const activeGroup: 'home' | 'assignments' | 'notifications' =
    activePage === 'dashboard' ? 'home' : activePage === 'notifications' ? 'notifications' : 'assignments'

  return [
    { label: 'Trang chủ', href: buildAdminPortalHref('dashboard'), isActive: activeGroup === 'home' },
    { label: 'Bài tập', href: buildAdminPortalHref('assignments'), isActive: activeGroup === 'assignments' },
    {
      label: 'Thông báo',
      href: buildAdminPortalHref('notifications'),
      isActive: activeGroup === 'notifications',
      badgeCount: unreadCount,
    },
  ]
}

export function buildAdminUserMenu(): HeaderUserMenuModel {
  return {
    label: adminProfileMock.fullName,
    items: [
      { label: 'Thông tin quản trị', href: buildAdminPortalHref('dashboard') + '#thong-tin' },
      { label: 'Đổi mật khẩu', href: buildAdminPortalHref('dashboard') + '#doi-mat-khau' },
      { label: 'Đăng xuất', href: '?' },
    ],
  }
}

export function buildAdminUtilityBar(): UtilityBarModel {
  return {
    helperText: 'Cổng chính thức của nhà trường',
    supportEmail: 'hotro@aiclassmate.edu.vn',
    hotline: '024 7300 8899',
    activeLanguage: 'VI',
  }
}

export function buildAdminPortalHref(page: AdminPageKey, params?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams({
    portal: 'admin',
    page,
  })

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value)
      }
    })
  }

  return `?${searchParams.toString()}`
}

export function getRoleLabel(role: string) {
  if (role === 'admin') return 'Admin'
  if (role === 'lecturer') return 'Giảng viên'
  if (role === 'student') return 'Sinh viên'
  return 'Không rõ'
}

export function getAccountStatusLabel(status: string) {
  if (status === 'active') return 'Đang hoạt động'
  if (status === 'disabled') return 'Đã khóa'
  if (status === 'pending') return 'Chờ kích hoạt'
  return 'Không rõ'
}

export function getClassStatusLabel(status: string) {
  if (status === 'active') return 'Đang mở'
  if (status === 'paused') return 'Tạm dừng'
  if (status === 'completed') return 'Đã kết thúc'
  return 'Không rõ'
}

export function getAssignmentStatusLabel(status: string) {
  if (status === 'draft') return 'Bản nháp'
  if (status === 'open') return 'Đang mở'
  if (status === 'closed') return 'Đã đóng'
  if (status === 'overdue') return 'Quá hạn'
  return 'Không rõ'
}

export function getSubmissionStatusLabel(status: string) {
  if (status === 'submitted') return 'Đã nộp'
  if (status === 'late') return 'Nộp trễ'
  if (status === 'draft') return 'Lưu nháp'
  if (status === 'missing') return 'Chưa nộp'
  return 'Không rõ'
}

export function getGradingStatusLabel(status: string) {
  if (status === 'graded') return 'Đã chấm'
  if (status === 'ungraded') return 'Chưa chấm'
  if (status === 'pending') return 'Chờ rà soát'
  return 'Không rõ'
}
