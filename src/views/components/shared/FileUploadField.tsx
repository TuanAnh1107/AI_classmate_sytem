type FileUploadFieldProps = {
  label: string
  helper?: string
  required?: boolean
  valueLabel?: string
  buttonLabel?: string
  onClick?: () => void
}

export function FileUploadField({
  label,
  helper,
  required = false,
  valueLabel,
  buttonLabel = 'Chọn tệp',
  onClick,
}: FileUploadFieldProps) {
  return (
    <div className="portal-file-drop">
      <div>
        <strong>
          {label}
          {required ? <span className="portal-form-required"> *</span> : null}
        </strong>
        {helper ? <p>{helper}</p> : null}
        {valueLabel ? <span className="portal-file-drop-value">{valueLabel}</span> : null}
      </div>
      <button type="button" className="portal-outline-button" onClick={onClick}>
        {buttonLabel}
      </button>
    </div>
  )
}

