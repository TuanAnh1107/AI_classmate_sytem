import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  meta?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, meta, actions }: PageHeaderProps) {
  return (
    <header className="portal-page-header">
      <div>
        {meta ? <p className="portal-page-kicker">{meta}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="portal-page-description">{description}</p> : null}
      </div>
      {actions ? <div className="portal-page-actions">{actions}</div> : null}
    </header>
  )
}
