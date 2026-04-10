import type { ReactNode } from 'react'

type ContentPanelProps = {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function ContentPanel({ title, actions, children, className }: ContentPanelProps) {
  return (
    <section className={`content-panel${className ? ` ${className}` : ''}`}>
      {title ? (
        <div className="content-panel-header">
          <h2>{title}</h2>
          {actions ? <div className="portal-button-row">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}
