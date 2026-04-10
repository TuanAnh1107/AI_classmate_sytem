import type { ReactNode } from 'react'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { PortalShellLayout } from './PortalShellLayout'

type LecturerPortalLayoutProps = {
  frame: LecturerPageFrame
  children: ReactNode
}

export function LecturerPortalLayout({ frame, children }: LecturerPortalLayoutProps) {
  return (
    <PortalShellLayout frame={frame} variant="lecturer">
      {children}
    </PortalShellLayout>
  )
}
