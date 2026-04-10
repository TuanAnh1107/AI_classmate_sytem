import type { ReactNode } from 'react'

export type AdminTableColumn = {
  id: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

type AdminTableShellProps = {
  columns: AdminTableColumn[]
  selectable?: boolean
  allSelected?: boolean
  onToggleAll?: () => void
  children: ReactNode
}

export function AdminTableShell({ columns, selectable, allSelected, onToggleAll, children }: AdminTableShellProps) {
  return (
    <div className="admin-table-shell">
      <table className="admin-table">
        <thead>
          <tr>
            {selectable ? (
              <th className="admin-table-checkbox">
                <input type="checkbox" checked={allSelected ?? false} onChange={onToggleAll} />
              </th>
            ) : null}
            {columns.map((column) => (
              <th key={column.id} style={column.width ? { width: column.width } : undefined} data-align={column.align ?? 'left'}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
