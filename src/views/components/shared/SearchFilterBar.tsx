import type { ReactNode } from 'react'

type SearchFilterBarProps = {
  placeholder?: string
  helper?: string
  children?: ReactNode
}

export function SearchFilterBar({
  placeholder = 'Tìm kiếm theo tiêu đề hoặc mã lớp',
  helper,
  children,
}: SearchFilterBarProps) {
  return (
    <div className="portal-search-bar">
      <div className="portal-search-input">
        <input type="text" placeholder={placeholder} aria-label="Tìm kiếm" />
        {helper ? <span>{helper}</span> : null}
      </div>
      {children ? <div className="portal-search-actions">{children}</div> : null}
    </div>
  )
}
