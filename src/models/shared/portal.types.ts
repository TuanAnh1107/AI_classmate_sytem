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
  badgeCount?: number
  kind?: 'link' | 'notifications'
  previewTitle?: string
  previewDescription?: string
  previewHref?: string
  previewEmptyText?: string
  previewItems?: PortalNotificationPreview[]
}

export interface PortalNotificationPreview {
  id: string
  content: string
  createdAtLabel: string
  isRead: boolean
  href: string
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

export interface PortalShellModel {
  utilityBar: UtilityBarModel
  brandName: string
  brandSubtitle: string
  navItems: PortalNavItem[]
  userMenu?: HeaderUserMenuModel
  footer: FooterModel
}

export interface PortalPageFrame {
  shell: PortalShellModel
  pageTitle: string
  pageDescription: string
  breadcrumbs: BreadcrumbItemModel[]
  tabs?: SecondaryTabModel[]
}

export type DataState = 'ready' | 'loading' | 'empty' | 'error'

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

