import type { FooterModel } from '../../../models/shared/portal.types'

type PortalFooterProps = {
  footer: FooterModel
}

export function PortalFooter({ footer }: PortalFooterProps) {
  return (
    <footer id="lien-he" className="footer-panel" data-reveal>
      <div className="site-footer-surface">
        <div className="container-block footer-grid">
          <section className="footer-brand-block">
            <h3>{footer.systemName}</h3>
            <p className="footer-subtitle">{footer.systemSubtitle}</p>
            <p>{footer.description}</p>
          </section>

          <section>
            <h3>Liên kết nhanh</h3>
            <ul>
              {footer.quickLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Liên hệ hỗ trợ</h3>
            <p>Email: {footer.supportEmail}</p>
            <p>Hotline: {footer.hotline}</p>
            {footer.supportItems.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </section>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{footer.copyright}</p>
      </div>
    </footer>
  )
}
