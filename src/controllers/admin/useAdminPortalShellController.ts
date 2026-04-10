import type { AdminPageKey, AdminPortalShellModel } from '../../models/admin/admin.types'
import { buildAdminNavItems, buildAdminPortalHref, buildAdminUserMenu, buildAdminUtilityBar } from '../../models/admin/admin.mappers'
import type { FooterModel } from '../../models/shared/portal.types'
import { adminProfileMock } from '../../models/admin/admin.mock'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getNotificationsForUser } from '../../services/domain/sourceOfTruth'

const footer: FooterModel = {
  systemName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
  systemSubtitle: 'Hệ thống đánh giá học tập thông minh',
  description: 'Nền tảng hỗ trợ giao bài, nộp bài, chấm điểm và phản hồi học tập cho giảng viên và sinh viên.',
  quickLinks: [
    { label: 'Trang chủ', href: '?portal=admin&page=dashboard' },
    { label: 'Bài tập', href: '?portal=admin&page=assignments' },
    { label: 'Thông báo', href: '?portal=admin&page=notifications' },
  ],
  supportEmail: 'hotro@aiclassmate.edu.vn',
  hotline: '024 7300 8899',
  supportItems: ['Trung tâm hỗ trợ người dùng', 'Liên hệ quản trị hệ thống'],
  copyright: '© 2026 Đại học Bách Khoa Hà Nội · AI Classmate System',
}

export function useAdminPortalShellController(activePage: AdminPageKey): AdminPortalShellModel {
  const notifications = getNotificationsForUser(adminProfileMock.id)
  const unreadCount = notifications.filter((item) => !item.is_read).length
  const previewItems = notifications.slice(0, 5).map((item) => ({
    id: item.id,
    content: item.content,
    createdAtLabel: formatPortalDateTime(item.created_at),
    isRead: item.is_read,
    href: buildAdminPortalHref('notifications', { notificationId: item.id }),
  }))

  return {
    utilityBar: buildAdminUtilityBar(),
    brandName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
    brandSubtitle: 'HỆ THỐNG ĐÁNH GIÁ HỌC TẬP THÔNG MINH',
    navItems: buildAdminNavItems(activePage, unreadCount).map((item) =>
      item.label === 'Thông báo'
        ? {
            ...item,
            kind: 'notifications',
            previewTitle: 'Thông báo vận hành',
            previewDescription: 'Đọc nhanh cảnh báo và cập nhật mới ngay trên header trước khi mở màn chi tiết.',
            previewHref: buildAdminPortalHref('notifications'),
            previewEmptyText: 'Hiện chưa có cảnh báo hoặc thông báo mới.',
            previewItems,
          }
        : item,
    ),
    userMenu: buildAdminUserMenu(),
    footer,
  }
}
