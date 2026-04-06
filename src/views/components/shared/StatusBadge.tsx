import type { StatusTone } from '../../../models/shared/portal.types'

type StatusBadgeProps = {
  label: string
  tone: StatusTone
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return <span className={`status-badge status-${tone}`}>{label}</span>
}

