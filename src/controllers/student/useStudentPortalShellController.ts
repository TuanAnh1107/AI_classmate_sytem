import type { StudentPageKey } from '../../models/app.types'
import type { StudentPortalShellModel } from '../../models/student/student.types'
import { buildStudentNavItems, buildStudentPortalHref, buildUserMenuLinks, formatPortalDateTime } from '../../models/student/student.mappers'
import { homePageData } from '../../models/homePageData'
import { studentProfileMock } from '../../models/student/student.mock'
import { getNotificationsForUser } from '../../services/domain/sourceOfTruth'

export function useStudentPortalShellController(activePage: StudentPageKey): StudentPortalShellModel {
  const notifications = getNotificationsForUser(studentProfileMock.id)
  const unreadCount = notifications.filter((item) => !item.is_read).length
  const previewItems = notifications.slice(0, 5).map((item) => ({
    id: item.id,
    content: item.content,
    createdAtLabel: formatPortalDateTime(item.created_at),
    isRead: item.is_read,
    href: buildStudentPortalHref('notifications', { notificationId: item.id }),
  }))

  return {
    utilityBar: homePageData.utilityBar,
    brandName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
    brandSubtitle: 'HỆ THỐNG ĐÁNH GIÁ HỌC TẬP THÔNG MINH',
    navItems: buildStudentNavItems(activePage, unreadCount).map((item) =>
      item.label === 'Thông báo'
        ? {
            ...item,
            kind: 'notifications',
            previewTitle: 'Thông báo gần đây',
            previewDescription: 'Đọc nhanh thông báo mới ngay trên header. Bấm vào từng dòng để mở chi tiết.',
            previewHref: buildStudentPortalHref('notifications'),
            previewEmptyText: 'Hiện chưa có thông báo mới cho bạn.',
            previewItems,
          }
        : item,
    ),
    userMenu: {
      label: `${studentProfileMock.fullName} · ${studentProfileMock.studentCode}`,
      items: buildUserMenuLinks(),
    },
    footer: homePageData.footer,
  }
}
