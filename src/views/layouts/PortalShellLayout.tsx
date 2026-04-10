import type { ReactNode } from 'react'
import '../../student-portal.css'
import type { PortalPageFrame } from '../../models/shared/portal.types'
import { Breadcrumbs } from '../components/shared/Breadcrumbs'
import { MainHeader } from '../components/shared/MainHeader'
import { PortalFooter } from '../components/shared/PortalFooter'

type PortalShellLayoutProps = {
  frame: PortalPageFrame
  children: ReactNode
  variant?: 'student' | 'lecturer' | 'admin'
}

export function PortalShellLayout({ frame, children, variant }: PortalShellLayoutProps) {
  return (
    <div className={`student-portal-shell${variant ? ` portal-variant-${variant}` : ''}`}>
      <MainHeader
        brandName={frame.shell.brandName}
        brandSubtitle={frame.shell.brandSubtitle}
        navItems={frame.shell.navItems}
        userMenu={frame.shell.userMenu}
        brandHref={buildBrandHref(variant)}
      />

      <main className="student-portal-main">
        <div className="portal-shell-container student-portal-container">
          <Breadcrumbs items={frame.breadcrumbs} />
          {children}
        </div>
      </main>

      <PortalFooter footer={frame.shell.footer} />
    </div>
  )
}

function buildBrandHref(variant?: PortalShellLayoutProps['variant']) {
  if (variant === 'student') {
    return '?portal=student&page=dashboard'
  }
  if (variant === 'lecturer') {
    return '?portal=lecturer&page=dashboard'
  }
  if (variant === 'admin') {
    return '?portal=admin&page=dashboard'
  }
  return '?'
}
