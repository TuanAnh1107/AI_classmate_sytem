type AdminTableSkeletonProps = {
  rows?: number
  columns?: number
}

export function AdminTableSkeleton({ rows = 6, columns = 6 }: AdminTableSkeletonProps) {
  return (
    <div className="admin-table-skeleton">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="admin-table-skeleton-row">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <span key={`cell-${rowIndex}-${colIndex}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
