type SavedView = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
}

type LecturerSavedViewBarProps = {
  views: SavedView[]
}

export function LecturerSavedViewBar({ views }: LecturerSavedViewBarProps) {
  return (
    <div className="lecturer-saved-views">
      {views.map((view) => (
        <button key={view.id} type="button" className={view.isActive ? 'is-active' : undefined} onClick={view.onClick}>
          {view.label}
        </button>
      ))}
    </div>
  )
}
