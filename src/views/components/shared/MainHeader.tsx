import { useEffect, useRef, useState } from 'react'
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
  const [openNotificationMenu, setOpenNotificationMenu] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const logoSrc = `${import.meta.env.BASE_URL}school-brand/logo-hust.jpg`

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenNotificationMenu(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenNotificationMenu(null)
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <header ref={headerRef} className="header-panel">
      <div className="site-header-surface">
        <div className="container site-header-inner">
          <a href={brandHref} className="site-brand-link">
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
            onClick={() => {
              setIsMenuOpen((prev) => !prev)
              setOpenNotificationMenu(null)
            }}
          >
            ☰
          </button>

          <div className={`header-navigation ${isMenuOpen ? 'is-open' : ''}`}>
            <ul className="site-nav-list">
              {navItems.map((item) => {
                if (item.kind === 'notifications') {
                  const isOpen = openNotificationMenu === item.label
                  return (
                    <li key={item.label} className="site-nav-notification-item">
                      <button
                        type="button"
                        className={`site-nav-trigger${item.isActive ? ' ACTIVE is-active' : ''}`}
                        aria-expanded={isOpen}
                        aria-haspopup="dialog"
                        onClick={() => setOpenNotificationMenu((prev) => (prev === item.label ? null : item.label))}
                      >
                        {item.label}
                        {item.badgeCount && item.badgeCount > 0 ? <span className="site-nav-badge">{item.badgeCount}</span> : null}
                      </button>

                      {isOpen ? (
                        <div className="site-nav-inbox-panel" role="dialog" aria-label={item.previewTitle ?? item.label}>
                          <div className="site-nav-inbox-head">
                            <div>
                              <strong>{item.previewTitle ?? item.label}</strong>
                              {item.previewDescription ? <p>{item.previewDescription}</p> : null}
                            </div>
                            <a href={item.previewHref ?? item.href} onClick={() => setOpenNotificationMenu(null)}>
                              Xem tất cả
                            </a>
                          </div>

                          {item.previewItems?.length ? (
                            <div className="site-nav-inbox-list">
                              {item.previewItems.map((preview) => (
                                <a
                                  key={preview.id}
                                  href={preview.href}
                                  className={`site-nav-inbox-link${preview.isRead ? '' : ' is-unread'}`}
                                  onClick={() => setOpenNotificationMenu(null)}
                                >
                                  <div className="site-nav-inbox-meta">
                                    <small>{preview.isRead ? 'Đã đọc' : 'Mới'}</small>
                                    <span>{preview.createdAtLabel}</span>
                                  </div>
                                  <p>{preview.content}</p>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <div className="site-nav-inbox-empty">{item.previewEmptyText ?? 'Chưa có thông báo.'}</div>
                          )}
                        </div>
                      ) : null}
                    </li>
                  )
                }

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={item.isActive ? 'ACTIVE is-active' : ''}
                      onClick={() => setOpenNotificationMenu(null)}
                    >
                      {item.label}
                      {item.badgeCount && item.badgeCount > 0 ? <span className="site-nav-badge">{item.badgeCount}</span> : null}
                    </a>
                  </li>
                )
              })}
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
            <a href={loginLink.href} className="header-login-button header-login-link">
              {loginLink.label}
            </a>
          ) : null}
        </div>
      </div>
    </header>
  )
}
