import type { ReactNode } from 'react'

type CollapsibleSectionProps = {
  title: string
  count?: string | number
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsibleSection({ title, count, defaultOpen = false, children }: CollapsibleSectionProps) {
  return (
    <details className="collapsible-section" open={defaultOpen}>
      <summary>
        <div className="collapsible-section-title">
          <span>{title}</span>
          {count !== undefined ? <span className="collapsible-section-count">{count}</span> : null}
        </div>
        <span className="collapsible-section-toggle" aria-hidden="true" />
      </summary>
      <div className="collapsible-section-body">{children}</div>
    </details>
  )
}
