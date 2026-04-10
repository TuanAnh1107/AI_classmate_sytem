import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { SelectInput } from '../shared/SelectInput'
import { TextInput } from '../shared/TextInput'

type SelectOption = {
  value: string
  label: string
}

export type LecturerFilterSelect = {
  id: string
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export type LecturerFilterText = {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export type LecturerFilterToolbarProps = {
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  selects?: LecturerFilterSelect[]
  textFilters?: LecturerFilterText[]
  sortOptions?: SelectOption[]
  sortValue?: string
  onSortChange?: (value: string) => void
  onReset?: () => void
  rightSlot?: ReactNode
  sticky?: boolean
}

export function LecturerFilterToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  selects,
  textFilters,
  sortOptions,
  sortValue,
  onSortChange,
  onReset,
  rightSlot,
  sticky,
}: LecturerFilterToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue)

  useEffect(() => {
    setLocalSearch(searchValue)
  }, [searchValue])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch)
      }
    }, 350)

    return () => window.clearTimeout(timer)
  }, [localSearch, onSearchChange, searchValue])

  return (
    <section className={`admin-filter-toolbar${sticky ? ' is-sticky' : ''}`}>
      <div className="admin-filter-row">
        <label className="admin-filter-search">
          <span>Tìm kiếm</span>
          <TextInput value={localSearch} placeholder={searchPlaceholder} onChange={setLocalSearch} />
        </label>

        {selects?.map((select) => (
          <label key={select.id} className="admin-filter-field">
            <span>{select.label}</span>
            <SelectInput value={select.value} options={select.options} onChange={select.onChange} />
          </label>
        ))}

        {textFilters?.map((filter) => (
          <label key={filter.id} className="admin-filter-field">
            <span>{filter.label}</span>
            <TextInput value={filter.value} placeholder={filter.placeholder} onChange={filter.onChange} />
          </label>
        ))}

        {sortOptions && onSortChange ? (
          <label className="admin-filter-field">
            <span>Sắp xếp</span>
            <SelectInput value={sortValue} options={sortOptions} onChange={onSortChange} />
          </label>
        ) : null}
      </div>

      <div className="admin-filter-actions">
        {onReset ? (
          <button className="admin-ghost-button" type="button" onClick={onReset}>
            Xóa bộ lọc
          </button>
        ) : null}
        {rightSlot}
      </div>
    </section>
  )
}
