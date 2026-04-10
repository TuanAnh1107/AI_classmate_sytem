import type { ReactNode } from 'react'

type DataTableProps = {
  headers: string[]
  children: ReactNode
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="portal-table-shell">
      <table className="portal-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
