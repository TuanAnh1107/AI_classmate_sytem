import type { HeroModel } from '../../models/homePageModel'

type HeroSectionProps = {
  hero: HeroModel
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="hero-banner" data-reveal>
      <div className="container hero-grid">
        <div className="hero-content-shell">
          {hero.eyebrow ? <p className="hero-eyebrow">{hero.eyebrow}</p> : null}
          <h1>{hero.title}</h1>
          <p className="hero-subheadline">{hero.subtitle}</p>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-actions">
            {hero.actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={action.variant === 'primary' ? 'hero-btn hero-btn-primary' : 'hero-btn hero-btn-secondary'}
              >
                {action.label}
              </a>
            ))}
          </div>

          <a href={hero.guideLink.href} className="hero-guide-link">
            {hero.guideLink.label}
          </a>
        </div>
      </div>
    </section>
  )
}
