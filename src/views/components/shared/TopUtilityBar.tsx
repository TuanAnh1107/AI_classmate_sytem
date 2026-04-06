import type { UtilityBarModel } from '../../../models/shared/portal.types'

type TopUtilityBarProps = {
  utilityBar: UtilityBarModel
}

export function TopUtilityBar({ utilityBar }: TopUtilityBarProps) {
  return (
    <div className="top-utility-bar">
      <div className="container utility-bar-content">
        <div className="utility-left">
          <span>{utilityBar.helperText}</span>
        </div>

        <div className="utility-right">
          <a href={`mailto:${utilityBar.supportEmail}`}>{utilityBar.supportEmail}</a>
          <span className="utility-divider" />
          <span>{utilityBar.hotline}</span>
          <span className="utility-divider" />
          <button type="button" className={utilityBar.activeLanguage === 'VI' ? 'is-active' : ''}>
            VI
          </button>
          <button type="button" className={utilityBar.activeLanguage === 'EN' ? 'is-active' : ''}>
            EN
          </button>
        </div>
      </div>
    </div>
  )
}

