import type { LecturerPageKey } from '../app.types'
import type { LinkItemModel, PortalNavItem } from '../shared/portal.types'

export function buildLecturerPortalHref(page: LecturerPageKey, params?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams({
    portal: 'lecturer',
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

export function buildLecturerNavItems(activePage: LecturerPageKey, unreadCount = 0): PortalNavItem[] {
  const activeMap: Record<LecturerPageKey, 'home' | 'assignments' | 'notifications'> = {
    dashboard: 'home',
    notifications: 'notifications',
    assignments: 'assignments',
    classes: 'assignments',
    'class-detail': 'assignments',
    'assignment-detail': 'assignments',
    'assignment-create': 'assignments',
    'assignment-edit': 'assignments',
    'submission-list': 'assignments',
    'submission-detail': 'assignments',
  }

  const activeGroup = activeMap[activePage]

  return [
    { label: 'Trang chủ', href: buildLecturerPortalHref('dashboard'), isActive: activeGroup === 'home' },
    { label: 'Bài tập', href: buildLecturerPortalHref('assignments'), isActive: activeGroup === 'assignments' },
    {
      label: 'Thông báo',
      href: buildLecturerPortalHref('notifications'),
      isActive: activeGroup === 'notifications',
      badgeCount: unreadCount,
    },
  ]
}

export function buildLecturerUserMenuLinks(): LinkItemModel[] {
  return [
    { label: 'Thông tin cá nhân', href: buildLecturerPortalHref('dashboard') + '#thong-tin' },
    { label: 'Đổi mật khẩu', href: buildLecturerPortalHref('dashboard') + '#doi-mat-khau' },
    { label: 'Đăng xuất', href: '?' },
  ]
}
