type LecturerDetailField = {
  label: string
  value: string
}

type LecturerDetailSection = {
  title: string
  fields: LecturerDetailField[]
}

type LecturerDetailPanelProps = {
  title: string
  subtitle?: string
  sections: LecturerDetailSection[]
}

export function LecturerDetailPanel({ title, subtitle, sections }: LecturerDetailPanelProps) {
  return (
    <aside className="admin-detail-panel">
      <header>
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="admin-detail-sections">
        {sections.map((section) => (
          <section key={section.title}>
            <h4>{section.title}</h4>
            <ul>
              {section.fields.map((field) => (
                <li key={field.label}>
                  <span>{field.label}</span>
                  <strong>{field.value}</strong>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  )
}
