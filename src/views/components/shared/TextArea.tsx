type TextAreaProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  readOnly?: boolean
}

export function TextArea({ value, defaultValue, placeholder, onChange, readOnly }: TextAreaProps) {
  return (
    <textarea
      className="portal-textarea"
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    />
  )
}
