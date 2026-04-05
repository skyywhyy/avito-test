import { ClearInputIcon } from '../../../shared/ui'
import type { FieldProps, SelectFieldProps } from '../model/types'

export function TextField({ label, required = false, value, onChange, className = '', error }: FieldProps) {
  return (
    <label className={`ad-edit-page__field ${className}`}>
      <span className="ad-edit-page__label">
        {required ? <span className="ad-edit-page__asterisk">*</span> : null}
        {label}
      </span>
      <div className="ad-edit-page__input-wrap">
        <input
          className={`ad-edit-page__input${error ? ' ad-edit-page__input--error' : ''}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button className="ad-edit-page__clear-button" type="button" aria-label={`Очистить поле ${label}`} onClick={() => onChange('')}>
            <ClearInputIcon />
          </button>
        ) : null}
      </div>
      {error ? <span className="ad-edit-page__field-error">{error}</span> : null}
    </label>
  )
}

export function SelectField({
  label,
  required = false,
  value,
  onChange,
  options,
  className = '',
  error,
}: SelectFieldProps) {
  return (
    <label className={`ad-edit-page__field ${className}`}>
      <span className="ad-edit-page__label">
        {required ? <span className="ad-edit-page__asterisk">*</span> : null}
        {label}
      </span>
      <div className="ad-edit-page__select-wrap">
        <select
          className={`ad-edit-page__input ad-edit-page__select${error ? ' ad-edit-page__input--error' : ''}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <span className="ad-edit-page__field-error">{error}</span> : null}
    </label>
  )
}
