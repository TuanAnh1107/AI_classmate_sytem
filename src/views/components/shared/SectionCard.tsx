import type { ReactNode } from 'react'

type SectionCardProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className="portal-section-card">
      {title ? (
        <header className="portal-section-head">
          <div>
            <h2>{title}</h2>
            {description ? <p className="portal-section-description">{description}</p> : null}
          </div>
          {actions ? <div className="portal-section-actions">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
