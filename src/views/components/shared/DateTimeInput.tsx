type DateTimeInputProps = {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export function DateTimeInput({ value, defaultValue, onChange }: DateTimeInputProps) {
  return (
    <input
      className="portal-input"
      type="datetime-local"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    />
  )
}
