import type { AnnouncementModel, SidePanelModel } from '../../models/homePageModel'

type AnnouncementsSectionProps = {
  announcements: AnnouncementModel[]
  sidePanels: SidePanelModel[]
}

function splitDateLabel(date: string) {
  const [day, month, year] = date.split('/')
  if (!day || !month || !year) {
    return { day: date, monthYear: '' }
  }

  return {
    day,
    monthYear: `${month}/${year}`,
  }
}

export function AnnouncementsSection({ announcements, sidePanels }: AnnouncementsSectionProps) {
  return (
    <section id="thong-bao" className="announcement-section" data-reveal>
      <div className="container-block announcement-layout">
        <div className="announcement-main">
          <div className="section-head">
            <div>
              <p className="section-kicker">Thông báo học vụ</p>
              <h2>Thông báo mới nhất</h2>
            </div>
            <a href="#">Xem tất cả</a>
          </div>

          <div className="announcement-list">
            {announcements.map((item) => {
              const dateParts = splitDateLabel(item.date)

              return (
                <article key={item.id} className="announcement-item">
                  <div className="announcement-meta" aria-label={`Ngày ${item.date}`}>
                    <span className="announcement-day">{dateParts.day}</span>
                    <span className="announcement-month-year">{dateParts.monthYear}</span>
                  </div>

                  <div className="announcement-body">
                    <h3 title={item.title}>{item.title}</h3>
                    <p>{item.summary}</p>
                    <a href={item.href}>Xem thêm</a>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="announcement-side">
          {sidePanels.map((panel) => (
            <section key={panel.title} id={panel.id} className="side-panel-card is-secondary">
              <header className="side-panel-head">
                <h3>{panel.title}</h3>
                {panel.caption ? <p>{panel.caption}</p> : null}
              </header>

              <ul>
                {panel.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </aside>
      </div>
    </section>
  )
}
