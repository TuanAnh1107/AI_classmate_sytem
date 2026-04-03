import { useState } from 'react'
import type { LinkItemModel, NavItemModel, UtilityBarModel } from '../../models/homePageModel'

type HomeHeaderProps = {
  utilityBar: UtilityBarModel
  brandName: string
  navItems: NavItemModel[]
  loginLink: LinkItemModel
}

export function HomeHeader({ utilityBar, brandName, navItems, loginLink }: HomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const logoSrc = `${import.meta.env.BASE_URL}school-brand/logo-hust.jpg`

  return (
    <>
      <div className="top-utility-bar">
        <div className="container utility-bar-content">
          <div className="utility-left">
            <span>{utilityBar.helperText}</span>
          </div>

          <div className="utility-right">
            <a href={`mailto:${utilityBar.supportEmail}`}>{utilityBar.supportEmail}</a>
            <span className="utility-divider" />
            <span>{utilityBar.hotline}</span>
            <span className="utility-divider" />
            <button type="button" className={utilityBar.activeLanguage === 'VI' ? 'is-active' : ''}>
              VI
            </button>
            <button type="button" className={utilityBar.activeLanguage === 'EN' ? 'is-active' : ''}>
              EN
            </button>
          </div>
        </div>
      </div>

      <header className="header-panel">
        <div className="site-header-surface">
          <div className="container site-header-inner">
            <a href="#" className="site-brand-link">
              <span className="brand-logo-badge" aria-hidden="true">
                <img src={logoSrc} alt="" />
              </span>
              <div>
                <p className="web-name-title">{brandName}</p>
                <p className="school-name-title">HỆ THỐNG ĐÁNH GIÁ HỌC TẬP THÔNG MINH</p>
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
                {navItems.map((item, index) => (
                  <li key={item.label}>
                    <a href={item.href} className={index === 0 ? 'ACTIVE' : ''}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a href={loginLink.href} className="header-login-button header-login-link">
              {loginLink.label}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
