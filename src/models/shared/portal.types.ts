export interface UtilityBarModel {
  helperText: string
  supportEmail: string
  hotline: string
  activeLanguage: 'VI' | 'EN'
}

export interface LinkItemModel {
  label: string
  href: string
  description?: string
}

export interface PortalNavItem {
  label: string
  href: string
  isActive?: boolean
}

export interface HeaderUserMenuModel {
  label: string
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

export interface BreadcrumbItemModel {
  label: string
  href?: string
}

export interface SecondaryTabModel {
  label: string
  href: string
  isActive?: boolean
}

export type DataState = 'ready' | 'loading' | 'empty' | 'error'

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

