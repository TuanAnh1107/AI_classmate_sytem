import type { ReactNode } from 'react'
import { PageHeader } from '../shared/PageHeader'

type LecturerPageHeaderProps = {
  title: string
  description?: string
  meta?: string
  actions?: ReactNode
}

export function LecturerPageHeader({ title, description, meta, actions }: LecturerPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <PageHeader title={title} description={description} meta={meta} actions={actions} />
    </div>
  )
}
