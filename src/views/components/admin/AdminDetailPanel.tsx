type AdminDetailField = {
  label: string
  value: string
}

type AdminDetailSection = {
  title: string
  fields: AdminDetailField[]
}

type AdminDetailPanelProps = {
  title: string
  subtitle?: string
  sections: AdminDetailSection[]
}

export function AdminDetailPanel({ title, subtitle, sections }: AdminDetailPanelProps) {
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
