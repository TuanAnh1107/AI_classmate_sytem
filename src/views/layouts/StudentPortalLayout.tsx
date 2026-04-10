import type { ReactNode } from 'react'
import type { StudentPageFrame } from '../../models/student/student.types'
import { PortalShellLayout } from './PortalShellLayout'

type StudentPortalLayoutProps = {
  frame: StudentPageFrame
  children: ReactNode
}

export function StudentPortalLayout({ frame, children }: StudentPortalLayoutProps) {
  return (
    <PortalShellLayout frame={frame} variant="student">
      {children}
    </PortalShellLayout>
  )
}
