type AttachmentListProps = {
  items: string[]
}

export function AttachmentList({ items }: AttachmentListProps) {
  if (!items.length) {
    return <p className="portal-muted-text">Chưa có tệp đính kèm.</p>
  }

  return (
    <ul className="portal-attachment-list">
      {items.map((item) => (
        <li key={item}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
