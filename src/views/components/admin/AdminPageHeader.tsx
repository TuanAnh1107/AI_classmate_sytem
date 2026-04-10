import type { ReactNode } from 'react'
import { PageHeader } from '../shared/PageHeader'

type AdminPageHeaderProps = {
  title: string
  description?: string
  meta?: string
  primaryAction?: ReactNode
  secondaryActions?: ReactNode
}

export function AdminPageHeader({ title, description, meta, primaryAction, secondaryActions }: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <PageHeader
        title={title}
        description={description}
        meta={meta}
        actions={
          primaryAction || secondaryActions ? (
            <div className="admin-page-header-actions">
              {secondaryActions}
              {primaryAction}
            </div>
          ) : undefined
        }
      />
    </div>
  )
}
