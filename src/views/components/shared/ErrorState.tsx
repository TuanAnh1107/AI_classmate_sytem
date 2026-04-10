type ErrorStateProps = {
  title?: string
  description: string
}

export function ErrorState({ title = 'Có lỗi xảy ra', description }: ErrorStateProps) {
  return (
    <div className="portal-inline-error" role="alert">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
