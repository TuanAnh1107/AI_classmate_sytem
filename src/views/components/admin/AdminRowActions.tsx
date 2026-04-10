type AdminRowAction = {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

type AdminRowActionsProps = {
  actions: AdminRowAction[]
}

export function AdminRowActions({ actions }: AdminRowActionsProps) {
  return (
    <div className="admin-row-actions">
      {actions.map((action) =>
        action.href ? (
          <a key={action.id} href={action.href}>
            {action.label}
          </a>
        ) : (
          <button key={action.id} type="button" onClick={action.onClick}>
            {action.label}
          </button>
        ),
      )}
    </div>
  )
}
