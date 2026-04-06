import type { ReactNode } from 'react'

type PageSectionProps = {
  title: string
  kicker?: string
  description?: string
  actions?: ReactNode
  className?: string
  children: ReactNode
}

export function PageSection({ title, kicker, description, actions, className, children }: PageSectionProps) {
  return (
    <section className={`portal-section-card${className ? ` ${className}` : ''}`}>
      <header className="portal-section-head">
        <div>
          {kicker ? <p className="portal-section-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
          {description ? <p className="portal-section-description">{description}</p> : null}
        </div>
        {actions ? <div className="portal-section-actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}

