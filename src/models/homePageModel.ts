import type { FooterModel, LinkItemModel, PortalNavItem, UtilityBarModel } from './shared/portal.types'

export interface HeroActionModel {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export interface HeroModel {
  eyebrow?: string
  title: string
  subtitle: string
  description: string
  actions: HeroActionModel[]
  guideLink: LinkItemModel
}

export interface AnnouncementModel {
  id: string
  title: string
  date: string
  summary: string
  href: string
}

export interface SidePanelModel {
  id?: string
  title: string
  caption?: string
  items: LinkItemModel[]
}

export interface HomePageViewModel {
  utilityBar: UtilityBarModel
  brandName: string
  navItems: PortalNavItem[]
  loginLink: LinkItemModel
  hero: HeroModel
  announcements: AnnouncementModel[]
  sidePanels: SidePanelModel[]
  footer: FooterModel
}

