type TextInputProps = {
  value?: string
  defaultValue?: string
  placeholder?: string
  type?: string
  onChange?: (value: string) => void
}

export function TextInput({ value, defaultValue, placeholder, type = 'text', onChange }: TextInputProps) {
  return (
    <input
      className="portal-input"
      type={type}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
    />
  )
}
