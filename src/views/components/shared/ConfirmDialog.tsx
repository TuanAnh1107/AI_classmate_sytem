import type { ReactNode } from 'react'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  extra?: ReactNode
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  onConfirm,
  onCancel,
  extra,
}: ConfirmDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="portal-confirm-overlay" role="dialog" aria-modal="true">
      <div className="portal-confirm-card">
        <h3>{title}</h3>
        <p>{description}</p>
        {extra ? <div className="portal-confirm-extra">{extra}</div> : null}
        <div className="portal-confirm-actions">
          <button type="button" className="portal-outline-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="portal-primary-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
