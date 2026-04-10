import { formatPortalDateTime } from '../../../models/student/student.mappers'

type DateTimeDisplayProps = {
  value: string
}

export function DateTimeDisplay({ value }: DateTimeDisplayProps) {
  return <time dateTime={value}>{formatPortalDateTime(value)}</time>
}
