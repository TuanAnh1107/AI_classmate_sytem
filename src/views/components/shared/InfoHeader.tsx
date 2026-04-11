import type { ReactNode } from 'react'
import type { StatusTone } from '../../../models/shared/portal.types'

export interface InfoHeaderBadge {
  label: string
  tone: StatusTone
}

export interface InfoHeaderStat {
  label: string
  value: string
}

type InfoHeaderProps = {
  title: string
  subtitle?: string
  badges?: InfoHeaderBadge[]
  stats?: InfoHeaderStat[]
  actions?: ReactNode
  scoreLabel?: string
}

export function InfoHeader({ title, subtitle, badges, stats, actions, scoreLabel }: InfoHeaderProps) {
  return (
    <div className="info-header">
      <div className="info-header-main">
        <div className="info-header-identity">
          <h1 className="info-header-title">{title}</h1>
          {subtitle ? <p className="info-header-subtitle">{subtitle}</p> : null}
          {badges?.length ? (
            <div className="info-header-badges">
              {badges.map((badge) => (
                <span key={badge.label} className={`status-badge status-${badge.tone}`}>
                  {badge.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {actions || scoreLabel ? (
          <div className="info-header-actions">
            {scoreLabel ? <span className="info-header-score">{scoreLabel}</span> : null}
            {actions}
          </div>
        ) : null}
      </div>
      {stats?.length ? (
        <div className="info-header-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="info-header-stat">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
