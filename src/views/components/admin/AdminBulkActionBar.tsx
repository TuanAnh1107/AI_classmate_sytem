type BulkAction = {
  id: string
  label: string
  tone?: 'primary' | 'danger'
  onClick: () => void
}

type AdminBulkActionBarProps = {
  selectedCount: number
  actions: BulkAction[]
  onClear: () => void
}

export function AdminBulkActionBar({ selectedCount, actions, onClear }: AdminBulkActionBarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="admin-bulk-bar">
      <div>{selectedCount} mục đã chọn</div>
      <div className="admin-bulk-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={action.tone === 'danger' ? 'danger' : undefined}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
        <button type="button" className="admin-ghost-button" onClick={onClear}>
          Bỏ chọn
        </button>
      </div>
    </div>
  )
}
