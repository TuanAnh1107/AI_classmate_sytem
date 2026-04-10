type LecturerTableSkeletonProps = {
  rows?: number
  columns?: number
}

export function LecturerTableSkeleton({ rows = 6, columns = 6 }: LecturerTableSkeletonProps) {
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
