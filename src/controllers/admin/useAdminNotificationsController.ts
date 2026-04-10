import { useEffect, useState } from 'react'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { adminProfileMock } from '../../models/admin/admin.mock'
import { buildAdminPortalHref } from '../../models/admin/admin.mappers'
import type { DataState } from '../../models/shared/portal.types'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getNotificationsForUser, markNotificationRead } from '../../services/domain/sourceOfTruth'
import { useAdminPortalShellController } from './useAdminPortalShellController'
import { useAdminQueryParams } from './useAdminQueryParams'

export type AdminNotificationFilter = 'all' | 'unread' | 'read'

export interface AdminNotificationRow {
  id: string
  content: string
  createdAtLabel: string
  isRead: boolean
  href: string
}

export interface AdminNotificationsViewModel {
  state: DataState
  frame: AdminPageFrame
  rows: AdminNotificationRow[]
  stats: { id: string; label: string; value: string }[]
  searchValue: string
  filterValue: AdminNotificationFilter
  selectedId?: string
  onSearchChange: (value: string) => void
  onFilterChange: (value: AdminNotificationFilter) => void
  errorMessage?: string
}

export function useAdminNotificationsController(state: DataState, selectedId?: string): AdminNotificationsViewModel {
  const shell = useAdminPortalShellController('notifications')
  const { query, setQuery } = useAdminQueryParams()
  const [, setRefreshTick] = useState(0)
  const safeFilter: AdminNotificationFilter =
    query.view === 'unread' || query.view === 'read' || query.view === 'all' ? (query.view as AdminNotificationFilter) : 'all'

  useEffect(() => {
    if (!selectedId) {
      return
    }

    markNotificationRead(selectedId)
    setRefreshTick((value) => value + 1)
  }, [selectedId])

  const notifications = getNotificationsForUser(adminProfileMock.id).map((item) => ({
    id: item.id,
    content: item.content,
    createdAt: item.created_at,
    isRead: item.is_read,
  }))

  const frame: AdminPageFrame = {
    shell,
    pageTitle: 'Thông báo',
    pageDescription: 'Tập trung các cảnh báo vận hành, phân quyền và cập nhật hệ thống trong cùng một workspace.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildAdminPortalHref('dashboard') },
      { label: 'Thông báo' },
    ],
  }

  const onSearchChange = (value: string) => setQuery({ search: value })
  const onFilterChange = (value: AdminNotificationFilter) => setQuery({ view: value })

  if (state === 'loading') {
    return {
      state,
      frame,
      rows: [],
      stats: [],
      searchValue: query.search,
      filterValue: safeFilter,
      selectedId,
      onSearchChange,
      onFilterChange,
    }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      rows: [],
      stats: [],
      searchValue: query.search,
      filterValue: safeFilter,
      selectedId,
      onSearchChange,
      onFilterChange,
      errorMessage: 'Không thể tải thông báo quản trị vào lúc này.',
    }
  }

  const filtered = notifications
    .filter((item) => {
      if (safeFilter === 'unread') return !item.isRead
      if (safeFilter === 'read') return item.isRead
      return true
    })
    .filter((item) => {
      if (!query.search) {
        return true
      }
      return item.content.toLowerCase().includes(query.search.toLowerCase())
    })

  const rows = filtered.map((item) => ({
    id: item.id,
    content: item.content,
    createdAtLabel: formatPortalDateTime(item.createdAt),
    isRead: item.isRead,
    href: buildAdminPortalHref('notifications', {
      notificationId: item.id,
      view: safeFilter,
      q: query.search || undefined,
    }),
  }))

  const stats = [
    { id: 'total', label: 'Tổng thông báo', value: String(notifications.length) },
    { id: 'unread', label: 'Chưa đọc', value: String(notifications.filter((item) => !item.isRead).length) },
    { id: 'read', label: 'Đã đọc', value: String(notifications.filter((item) => item.isRead).length) },
  ]

  if (state === 'empty' || !rows.length) {
    return {
      state: 'empty',
      frame,
      rows: [],
      stats,
      searchValue: query.search,
      filterValue: safeFilter,
      selectedId,
      onSearchChange,
      onFilterChange,
    }
  }

  return {
    state,
    frame,
    rows,
    stats,
    searchValue: query.search,
    filterValue: safeFilter,
    selectedId: selectedId ?? rows[0]?.id,
    onSearchChange,
    onFilterChange,
  }
}
