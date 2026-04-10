import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

type FilterOption = {
  value: string
  label: string
}

export type FilterField = {
  id: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

type SortField = {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

type SearchField = {
  placeholder?: string
  helper?: string
  value: string
  onChange: (value: string) => void
}

type StudentFilterToolbarProps = {
  search: SearchField
  filters?: FilterField[]
  sort?: SortField
  actions?: ReactNode
  sticky?: boolean
}

export function StudentFilterToolbar({ search, filters = [], sort, actions, sticky }: StudentFilterToolbarProps) {
  const [localSearch, setLocalSearch] = useState(search.value)

  useEffect(() => {
    setLocalSearch(search.value)
  }, [search.value])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localSearch !== search.value) {
        search.onChange(localSearch)
      }
    }, 250)

    return () => window.clearTimeout(timer)
  }, [localSearch, search])

  return (
    <div className={`student-filter-toolbar${sticky ? ' is-sticky' : ''}`}>
      <div className="student-filter-grid">
        <div className="student-filter-search">
          <label>
            <span>Tìm kiếm</span>
            <input
              type="text"
              placeholder={search.placeholder ?? 'Nhập tên bài, mã lớp hoặc từ khóa'}
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
            />
          </label>
          {search.helper ? <p>{search.helper}</p> : null}
        </div>

        {filters.map((filter) => (
          <label key={filter.id} className="student-filter-field">
            <span>{filter.label}</span>
            <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)}>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        {sort ? (
          <label className="student-filter-field">
            <span>{sort.label}</span>
            <select value={sort.value} onChange={(event) => sort.onChange(event.target.value)}>
              {sort.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {actions ? <div className="student-filter-actions">{actions}</div> : null}
    </div>
  )
}
