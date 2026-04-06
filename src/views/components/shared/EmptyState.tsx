import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="portal-empty-state" role="status">
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="portal-empty-action">{action}</div> : null}
    </div>
  )
}

