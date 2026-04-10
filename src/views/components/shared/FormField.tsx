import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  helper?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, helper, required, children }: FormFieldProps) {
  return (
    <div className="portal-form-field">
      <label className="portal-form-label">
        {label}
        {required ? <span className="portal-form-required">*</span> : null}
      </label>
      {children}
      {helper ? <p className="portal-form-help">{helper}</p> : null}
    </div>
  )
}
