export interface UtilityBarModel {
  helperText: string
  supportEmail: string
  hotline: string
  activeLanguage: 'VI' | 'EN'
}

export interface NavItemModel {
  label: string
  href: string
}

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

export interface LinkItemModel {
  label: string
  href: string
  description?: string
}

export interface SidePanelModel {
  id?: string
  title: string
  caption?: string
  items: LinkItemModel[]
}

export interface FooterModel {
  systemName: string
  systemSubtitle: string
  description: string
  quickLinks: LinkItemModel[]
  supportEmail: string
  hotline: string
  supportItems: string[]
  copyright: string
}

export interface HomePageViewModel {
  utilityBar: UtilityBarModel
  brandName: string
  navItems: NavItemModel[]
  loginLink: LinkItemModel
  hero: HeroModel
  announcements: AnnouncementModel[]
  sidePanels: SidePanelModel[]
  footer: FooterModel
}
