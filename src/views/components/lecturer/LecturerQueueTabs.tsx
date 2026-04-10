type QueueTab = {
  id: string
  label: string
  count?: number
  isActive?: boolean
  onClick: () => void
}

type LecturerQueueTabsProps = {
  tabs: QueueTab[]
}

export function LecturerQueueTabs({ tabs }: LecturerQueueTabsProps) {
  return (
    <div className="lecturer-queue-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.isActive ? 'is-active' : undefined}
          onClick={tab.onClick}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined ? <strong>{tab.count}</strong> : null}
        </button>
      ))}
    </div>
  )
}
