type RoleBadgeProps = {
  label: string
  tone?: 'admin' | 'lecturer' | 'student'
}

export function RoleBadge({ label, tone }: RoleBadgeProps) {
  return <span className={`portal-role-badge${tone ? ` tone-${tone}` : ''}`}>{label}</span>
}
