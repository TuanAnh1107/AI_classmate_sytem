import type { ReactNode } from 'react'

type FormRowProps = {
  children: ReactNode
}

export function FormRow({ children }: FormRowProps) {
  return <div className="portal-form-row">{children}</div>
}
