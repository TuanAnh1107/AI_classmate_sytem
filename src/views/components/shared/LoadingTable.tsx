type LoadingTableProps = {
  rows?: number
  columns?: number
}

export function LoadingTable({ rows = 6, columns = 6 }: LoadingTableProps) {
  return (
    <div className="portal-table-skeleton" aria-hidden="true">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="portal-table-skeleton-row"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <span key={`cell-${rowIndex}-${colIndex}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
