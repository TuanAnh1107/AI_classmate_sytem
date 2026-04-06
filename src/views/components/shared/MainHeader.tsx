import { useState } from 'react'
import type { HeaderUserMenuModel, LinkItemModel, PortalNavItem } from '../../../models/shared/portal.types'

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
  const logoSrc = `${import.meta.env.BASE_URL}school-brand/logo-hust.jpg`

  return (
    <header className="header-panel">
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
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          <div className={`header-navigation ${isMenuOpen ? 'is-open' : ''}`}>
            <ul className="site-nav-list">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={item.isActive ? 'ACTIVE' : ''}>
                    {item.label}
                  </a>
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
            <a href={loginLink.href} className="header-login-button header-login-link">
              {loginLink.label}
            </a>
          ) : null}
        </div>
      </div>
    </header>
  )
}
