export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options,
  min,
  max,
  step,
  placeholder,
  helperText,
  suggestions,
  full = false,
  ...rest
}) {
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {options ? (
        <select id={name} name={name} value={value} onChange={onChange} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} {...rest} />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          list={suggestions?.length ? `${name}-suggestions` : undefined}
          {...rest}
        />
      )}
      {suggestions?.length ? (
        <datalist id={`${name}-suggestions`}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      ) : null}
      {helperText ? <small className="field-helper">{helperText}</small> : null}
    </div>
  );
}
