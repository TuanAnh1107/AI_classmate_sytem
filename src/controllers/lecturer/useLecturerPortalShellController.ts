import type { LecturerPageKey } from '../../models/app.types'
import type { LecturerPortalShellModel } from '../../models/lecturer/lecturer.types'
import {
  buildLecturerNavItems,
  buildLecturerPortalHref,
  buildLecturerUserMenuLinks,
} from '../../models/lecturer/lecturer.mappers'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { homePageData } from '../../models/homePageData'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getNotificationsForUser } from '../../services/domain/sourceOfTruth'

export function useLecturerPortalShellController(activePage: LecturerPageKey): LecturerPortalShellModel {
  const notifications = getNotificationsForUser(lecturerProfileMock.id)
  const unreadCount = notifications.filter((item) => !item.is_read).length
  const previewItems = notifications.slice(0, 5).map((item) => ({
    id: item.id,
    content: item.content,
    createdAtLabel: formatPortalDateTime(item.created_at),
    isRead: item.is_read,
    href: buildLecturerPortalHref('notifications', { notificationId: item.id }),
  }))

  return {
    utilityBar: homePageData.utilityBar,
    brandName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
    brandSubtitle: 'HỆ THỐNG ĐÁNH GIÁ HỌC TẬP THÔNG MINH',
    navItems: buildLecturerNavItems(activePage, unreadCount).map((item) =>
      item.label === 'Thông báo'
        ? {
            ...item,
            kind: 'notifications',
            previewTitle: 'Thông báo giảng dạy',
            previewDescription: 'Mở nhanh inbox thông báo. Bấm từng dòng để vào chi tiết cụ thể.',
            previewHref: buildLecturerPortalHref('notifications'),
            previewEmptyText: 'Hiện chưa có thông báo mới cho giảng viên.',
            previewItems,
          }
        : item,
    ),
    userMenu: {
      label: `${lecturerProfileMock.fullName} · ${lecturerProfileMock.lecturerCode}`,
      items: buildLecturerUserMenuLinks(),
    },
    footer: homePageData.footer,
  }
}
