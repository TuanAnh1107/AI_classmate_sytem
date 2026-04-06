import type { ReactNode } from 'react'
import '../../student-portal.css'
import type { StudentPageFrame } from '../../models/student/student.types'
import { Breadcrumbs } from '../components/shared/Breadcrumbs'
import { MainHeader } from '../components/shared/MainHeader'
import { PortalFooter } from '../components/shared/PortalFooter'
import { TopUtilityBar } from '../components/shared/TopUtilityBar'

type StudentPortalLayoutProps = {
  frame: StudentPageFrame
  children: ReactNode
}

export function StudentPortalLayout({ frame, children }: StudentPortalLayoutProps) {
  return (
    <div className="student-portal-shell">
      <TopUtilityBar utilityBar={frame.shell.utilityBar} />
      <MainHeader
        brandName={frame.shell.brandName}
        brandSubtitle={frame.shell.brandSubtitle}
        navItems={frame.shell.navItems}
        userMenu={frame.shell.userMenu}
        brandHref={buildBrandHref()}
      />

      <main className="student-portal-main">
        <div className="container-block student-portal-container">
          <Breadcrumbs items={frame.breadcrumbs} />

          <section className="student-page-hero">
            <div>
              <h1>{frame.pageTitle}</h1>
              <p>{frame.pageDescription}</p>
            </div>
          </section>

          {frame.tabs?.length ? (
            <nav className="portal-secondary-tabs" aria-label="Điều hướng nội dung lớp học">
              {frame.tabs.map((tab) => (
                <a key={tab.label} href={tab.href} className={tab.isActive ? 'is-active' : ''}>
                  {tab.label}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="student-page-body">{children}</div>
        </div>
      </main>

      <PortalFooter footer={frame.shell.footer} />
    </div>
  )
}

function buildBrandHref() {
  return '?'
}
