type SavedViewOption = {
  id: string
  label: string
  description?: string
}

type StudentSavedViewsProps = {
  views: SavedViewOption[]
  activeId: string
  onChange: (id: string) => void
}

export function StudentSavedViews({ views, activeId, onChange }: StudentSavedViewsProps) {
  return (
    <div className="student-saved-views" role="tablist" aria-label="Bộ lọc nhanh">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          className={view.id === activeId ? 'is-active' : ''}
          onClick={() => onChange(view.id)}
        >
          <span>{view.label}</span>
          {view.description ? <small>{view.description}</small> : null}
        </button>
      ))}
    </div>
  )
}
