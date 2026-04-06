type LoadingStateProps = {
  title?: string
  description?: string
}

export function LoadingState({
  title = 'Đang tải dữ liệu',
  description = 'Hệ thống đang chuẩn bị nội dung cho trang này.',
}: LoadingStateProps) {
  return (
    <div className="portal-loading-state" role="status" aria-live="polite">
      <span className="portal-loading-spinner" aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
