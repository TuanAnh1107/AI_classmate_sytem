import type { BreadcrumbItemModel } from '../../../models/shared/portal.types'

type BreadcrumbsProps = {
  items: BreadcrumbItemModel[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Điều hướng trang" className="portal-breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href && index < items.length - 1 ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
