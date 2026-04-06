import type { StudentPageKey } from '../../models/app.types'
import type { StudentPortalShellModel } from '../../models/student/student.types'
import { buildStudentNavItems, buildUserMenuLinks } from '../../models/student/student.mappers'
import { homePageData } from '../../models/homePageData'
import { studentProfileMock } from '../../models/student/student.mock'

export function useStudentPortalShellController(activePage: StudentPageKey): StudentPortalShellModel {
  return {
    utilityBar: homePageData.utilityBar,
    brandName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
    brandSubtitle: 'HỆ THỐNG ĐÁNH GIÁ HỌC TẬP THÔNG MINH',
    navItems: buildStudentNavItems(activePage),
    userMenu: {
      label: `${studentProfileMock.fullName} · ${studentProfileMock.studentCode}`,
      items: buildUserMenuLinks(),
    },
    footer: homePageData.footer,
  }
}
