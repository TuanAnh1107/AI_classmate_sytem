import { useState } from 'react'
import type {
  HeaderUserMenuModel,
  LinkItemModel,
  PortalNavItem,
} from '../../../models/shared/portal.types'

type MainHeaderProps = {
  brandName: string
  brandSubtitle: string
  navItems: PortalNavItem[]
  brandHref?: string
  loginLink?: LinkItemModel
  userMenu?: HeaderUserMenuModel
}

export function MainHeader({
  brandName,
  brandSubtitle,
  navItems,
  brandHref = '#',
  loginLink,
  userMenu,
}: MainHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openPreviewLabel, setOpenPreviewLabel] = useState<string | null>(null)
  const logoSrc = `${import.meta.env.BASE_URL}school-brand/logo-hust.jpg`

  const closePreview = () => setOpenPreviewLabel(null)

  return (
    <header className="header-panel">
      <div className="site-header-surface">
        <div className="container site-header-inner">
          <a href={brandHref} className="site-brand-link" onClick={closePreview}>
            <span className="brand-logo-badge" aria-hidden="true">
              <img src={logoSrc} alt="" />
            </span>
            <div>
              <p className="web-name-title">{brandName}</p>
              <p className="school-name-title">{brandSubtitle}</p>
            </div>
          </a>

          <button
            type="button"
            className="mobile-nav-toggle"
            aria-expanded={isMenuOpen}
            aria-label="Mở menu điều hướng"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <div className={`header-navigation ${isMenuOpen ? 'is-open' : ''}`}>
            <ul className="site-nav-list">
              {navItems.map((item) => (
                <li key={item.label} className={item.kind === 'notifications' ? 'site-nav-notification-item' : ''}>
                  {item.kind === 'notifications' ? (
                    <>
                      <button
                        type="button"
                        className={`site-nav-trigger${item.isActive ? ' ACTIVE is-active' : ''}`}
                        aria-expanded={openPreviewLabel === item.label}
                        onClick={() => setOpenPreviewLabel((prev) => (prev === item.label ? null : item.label))}
                      >
                        {item.label}
                        {item.badgeCount && item.badgeCount > 0 ? <span className="site-nav-badge">{item.badgeCount}</span> : null}
                      </button>

                      {openPreviewLabel === item.label ? (
                        <div className="site-nav-inbox-panel">
                          <div className="site-nav-inbox-head">
                            <div>
                              <strong>{item.previewTitle ?? item.label}</strong>
                              {item.previewDescription ? <p>{item.previewDescription}</p> : null}
                            </div>
                            <a href={item.previewHref ?? item.href} onClick={closePreview}>
                              Xem tất cả
                            </a>
                          </div>

                          <div className="site-nav-inbox-list">
                            {item.previewItems?.length ? (
                              item.previewItems.map((preview) => (
                                <a
                                  key={preview.id}
                                  href={preview.href}
                                  className={`site-nav-inbox-link${preview.isRead ? '' : ' is-unread'}`}
                                  onClick={closePreview}
                                >
                                  <div className="site-nav-inbox-meta">
                                    <span>{preview.createdAtLabel}</span>
                                    <small>{preview.isRead ? 'Đã đọc' : 'Mới'}</small>
                                  </div>
                                  <p>{preview.content}</p>
                                </a>
                              ))
                            ) : (
                              <div className="site-nav-inbox-empty">{item.previewEmptyText ?? 'Chưa có thông báo mới.'}</div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <a href={item.href} className={item.isActive ? 'ACTIVE is-active' : ''} onClick={closePreview}>
                      {item.label}
                      {item.badgeCount && item.badgeCount > 0 ? <span className="site-nav-badge">{item.badgeCount}</span> : null}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {userMenu ? (
            <details className="header-user-menu">
              <summary className="header-user-button">{userMenu.label}</summary>
              <div className="header-user-panel">
                {userMenu.items.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            </details>
          ) : null}

          {loginLink ? (
            <a href={loginLink.href} className="header-login-button header-login-link" onClick={closePreview}>
              {loginLink.label}
            </a>
          ) : null}
        </div>
      </div>
    </header>
  )
}
