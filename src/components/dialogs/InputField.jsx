import React from "react";

export default function InputField({
  type,
  id,
  label,
  value,
  onChange,
  disabled,
  required,
  readonly,
  autoFocus,
  min,
  max,
  step,
  pattern,
  title,
  placeholder,
  size,
  maxLength,
  multiple,
  autocomplete,
  options,
  checked,
}) {
  switch (type) {
    case "checkbox":
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <br />
          <input
            type={type}
            id={id}
            name={id}
            checked={value || checked}
            onChange={(e) => onChange(id, e.target.checked)}
            disabled={disabled}
            required={required}
            readOnly={readonly}
            autoFocus={autoFocus}
          />
        </div>
      );
    case "radio":
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <br />
          {options.map((o, j) => (
            <div key={j}>
              <label htmlFor={o.id}>{o.label}</label>
              <br />
              <input
                type={type}
                id={o.id}
                name={id}
                value={o.value}
                checked={value === o.value}
                onChange={(e) => onChange(id, e.target.value)}
                disabled={o.disabled}
                required={required}
                readOnly={o.readonly}
                autoFocus={autoFocus}
              />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <br />
          <input
            type={type}
            id={id}
            name={id}
            value={value || ""}
            onChange={(e) => onChange(id, e.target.value)}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            title={title}
            placeholder={placeholder}
            size={size}
            maxLength={maxLength}
            multiple={multiple}
            disabled={disabled}
            required={required}
            readOnly={readonly}
            autoFocus={autoFocus}
            autoComplete={autocomplete}
          />
        </div>
      );
  }
}