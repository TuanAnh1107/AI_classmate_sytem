import type { ReactNode } from 'react'

type DisclosureSectionProps = {
  title: string
  kicker?: string
  description?: string
  summary?: ReactNode
  defaultOpen?: boolean
  className?: string
  children: ReactNode
}

export function DisclosureSection({
  title,
  kicker,
  description,
  summary,
  defaultOpen = false,
  className,
  children,
}: DisclosureSectionProps) {
  return (
    <details className={`portal-disclosure${className ? ` ${className}` : ''}`} open={defaultOpen}>
      <summary className="portal-disclosure-summary">
        <div className="portal-disclosure-copy">
          {kicker ? <p className="portal-section-kicker">{kicker}</p> : null}
          <h3>{title}</h3>
          {description ? <p className="portal-disclosure-description">{description}</p> : null}
        </div>
        <div className="portal-disclosure-side">
          {summary ? <div className="portal-disclosure-meta">{summary}</div> : null}
          <span className="portal-disclosure-toggle" aria-hidden="true" />
        </div>
      </summary>
      <div className="portal-disclosure-body">{children}</div>
    </details>
  )
}

