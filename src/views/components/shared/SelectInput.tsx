type SelectOption = {
  value: string
  label: string
}

type SelectInputProps = {
  value?: string
  options: SelectOption[]
  onChange?: (value: string) => void
}

export function SelectInput({ value, options, onChange }: SelectInputProps) {
  return (
    <select className="portal-input" value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
