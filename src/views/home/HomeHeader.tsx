import type { LinkItemModel, PortalNavItem, UtilityBarModel } from '../../models/shared/portal.types'
import { MainHeader } from '../components/shared/MainHeader'
import { TopUtilityBar } from '../components/shared/TopUtilityBar'

type HomeHeaderProps = {
  utilityBar: UtilityBarModel
  brandName: string
  navItems: PortalNavItem[]
  loginLink: LinkItemModel
}

export function HomeHeader({ utilityBar, brandName, navItems, loginLink }: HomeHeaderProps) {
  return (
    <>
      <TopUtilityBar utilityBar={utilityBar} />
      <MainHeader
        brandName={brandName}
        brandSubtitle="HỆ THỐNG ĐÁNH GIÁ HỌC TẬP THÔNG MINH"
        navItems={navItems}
        loginLink={loginLink}
      />
    </>
  )
}
