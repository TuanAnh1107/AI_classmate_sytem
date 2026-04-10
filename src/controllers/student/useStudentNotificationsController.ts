import { useEffect, useState } from 'react'
import type { DataState } from '../../models/shared/portal.types'
import type { StudentPageFrame } from '../../models/student/student.types'
import { buildStudentPortalHref, formatPortalDateTime } from '../../models/student/student.mappers'
import { studentProfileMock } from '../../models/student/student.mock'
import { getNotificationsForUser, markNotificationRead } from '../../services/domain/sourceOfTruth'
import { useStudentPortalShellController } from './useStudentPortalShellController'
import { useStudentQueryParams } from './useStudentQueryParams'

export type NotificationFilter = 'all' | 'unread' | 'read'

export interface StudentNotificationRow {
  id: string
  content: string
  createdAtLabel: string
  isRead: boolean
  href: string
}

export interface StudentNotificationsViewModel {
  state: DataState
  frame: StudentPageFrame
  rows: StudentNotificationRow[]
  stats: { id: string; label: string; value: string }[]
  searchValue: string
  filterValue: NotificationFilter
  selectedId?: string
  onSearchChange: (value: string) => void
  onFilterChange: (value: NotificationFilter) => void
  errorMessage?: string
}

export function useStudentNotificationsController(
  state: DataState,
  selectedId?: string,
): StudentNotificationsViewModel {
  const shell = useStudentPortalShellController('notifications')
  const { query, setQuery } = useStudentQueryParams()
  const [, setRefreshTick] = useState(0)
  const safeFilter: NotificationFilter =
    query.view === 'unread' || query.view === 'read' || query.view === 'all' ? (query.view as NotificationFilter) : 'all'

  useEffect(() => {
    if (!selectedId) {
      return
    }

    markNotificationRead(selectedId)
    setRefreshTick((value) => value + 1)
  }, [selectedId])

  const notifications = getNotificationsForUser(studentProfileMock.id).map((item) => ({
    id: item.id,
    content: item.content,
    createdAt: item.created_at,
    isRead: item.is_read,
  }))

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Thông báo',
    pageDescription: 'Tập trung các cập nhật mới về bài tập, kết quả và thay đổi liên quan đến lớp học của bạn.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Thông báo' },
    ],
  }

  const onSearchChange = (value: string) => setQuery({ search: value })
  const onFilterChange = (value: NotificationFilter) => setQuery({ view: value })

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
      errorMessage: 'Không thể tải danh sách thông báo vào lúc này.',
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
    href: buildStudentPortalHref('notifications', {
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
