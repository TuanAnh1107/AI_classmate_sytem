import { useEffect, useState } from 'react'
import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { buildLecturerPortalHref } from '../../models/lecturer/lecturer.mappers'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getNotificationsForUser, markNotificationRead } from '../../services/domain/sourceOfTruth'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { useLecturerQueryParams } from './useLecturerQueryParams'

export type LecturerNotificationFilter = 'all' | 'unread' | 'read'

export interface LecturerNotificationRow {
  id: string
  content: string
  createdAtLabel: string
  isRead: boolean
  href: string
}

export interface LecturerNotificationsViewModel {
  state: DataState
  frame: LecturerPageFrame
  rows: LecturerNotificationRow[]
  stats: { id: string; label: string; value: string }[]
  searchValue: string
  filterValue: LecturerNotificationFilter
  selectedId?: string
  onSearchChange: (value: string) => void
  onFilterChange: (value: LecturerNotificationFilter) => void
  errorMessage?: string
}

export function useLecturerNotificationsController(
  state: DataState,
  selectedId?: string,
): LecturerNotificationsViewModel {
  const shell = useLecturerPortalShellController('notifications')
  const { query, setQuery } = useLecturerQueryParams()
  const [, setRefreshTick] = useState(0)
  const safeFilter: LecturerNotificationFilter =
    query.view === 'unread' || query.view === 'read' || query.view === 'all' ? (query.view as LecturerNotificationFilter) : 'all'

  useEffect(() => {
    if (!selectedId) {
      return
    }

    markNotificationRead(selectedId)
    setRefreshTick((value) => value + 1)
  }, [selectedId])

  const notifications = getNotificationsForUser(lecturerProfileMock.id).map((item) => ({
    id: item.id,
    content: item.content,
    createdAt: item.created_at,
    isRead: item.is_read,
  }))

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: 'Thông báo',
    pageDescription: 'Theo dõi cập nhật điều phối lớp, hàng chấm và các cảnh báo liên quan đến bài tập bạn phụ trách.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildLecturerPortalHref('dashboard') },
      { label: 'Thông báo' },
    ],
  }

  const onSearchChange = (value: string) => setQuery({ search: value })
  const onFilterChange = (value: LecturerNotificationFilter) => setQuery({ view: value })

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
      errorMessage: 'Không thể tải thông báo giảng viên vào lúc này.',
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
    href: buildLecturerPortalHref('notifications', {
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
