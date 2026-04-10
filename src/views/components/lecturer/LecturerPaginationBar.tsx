import { SelectInput } from '../shared/SelectInput'

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const pageSizeOptions = [
  { value: '10', label: '10 / trang' },
  { value: '20', label: '20 / trang' },
  { value: '50', label: '50 / trang' },
  { value: '100', label: '100 / trang' },
]

export function LecturerPaginationBar({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-info">
        {total === 0 ? 'Không có kết quả' : `Hiển thị ${from}–${to} / ${total} kết quả`}
      </div>
      <div className="admin-pagination-actions">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Sau
        </button>
        <SelectInput value={String(pageSize)} options={pageSizeOptions} onChange={(value) => onPageSizeChange(Number(value))} />
      </div>
    </div>
  )
}
