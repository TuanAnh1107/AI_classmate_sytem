import type { ReactNode } from 'react'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { PortalShellLayout } from './PortalShellLayout'

type AdminPortalLayoutProps = {
  frame: AdminPageFrame
  children: ReactNode
}

export function AdminPortalLayout({ frame, children }: AdminPortalLayoutProps) {
  return (
    <PortalShellLayout frame={frame} variant="admin">
      {children}
    </PortalShellLayout>
  )
}
