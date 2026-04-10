type LecturerRowAction = {
  id: string
  label: string
  href?: string
  onClick?: () => void
}

type LecturerRowActionsProps = {
  actions: LecturerRowAction[]
}

export function LecturerRowActions({ actions }: LecturerRowActionsProps) {
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
