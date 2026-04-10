type PortalSectionTab = {
  id: string
  label: string
  countLabel?: string
}

type PortalSectionTabsProps = {
  items: PortalSectionTab[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function PortalSectionTabs({ items, activeId, onChange, className }: PortalSectionTabsProps) {
  return (
    <div className={`portal-section-tabs${className ? ` ${className}` : ''}`} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          className={`portal-section-tab${item.id === activeId ? ' is-active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span>{item.label}</span>
          {item.countLabel ? <strong>{item.countLabel}</strong> : null}
        </button>
      ))}
    </div>
  )
}
