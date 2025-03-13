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
  autofocus,
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
  description,
  optionsGrouped,
}) {
  switch (type) {
    case "checkbox":
      return (
        <div className="input">
          <label htmlFor={id}>
            {label}
            {description && <p>{description}</p>}
            <input
              type={type}
              id={id}
              name={id}
              checked={checked}
              onChange={(e) => onChange(id, e.target.value)}
              disabled={disabled}
              required={required}
              readOnly={readonly}
              autoFocus={autofocus}
            />
          </label>
        </div>
      );
    case "radio":
      return (
        <div className="input">
          <label id={id}>
            {label}
            {description && <p>{description}</p>}
            {options.map((o, j) => (
              <div key={j}>
                <label htmlFor={o.id}>
                  {o.label}
                  <input
                    title={o.label}
                    type={type}
                    id={o.id}
                    name={id}
                    value={o.value}
                    onChange={(e) => onChange(id, e.target.value)}
                    disabled={o.disabled}
                    required={required}
                    readOnly={o.readonly}
                    autoFocus={autofocus}
                  />
                </label>
              </div>
            ))}
          </label>
        </div>
      );
    case "select":
      return (
        <div className="input">
          <label htmlFor={id}>
            {label}
            {description && <p>{description}</p>}
            <select name={id} id={id}>
              {optionsGrouped.map((g, i) => (
                <optgroup key={i} label={g.label}>
                  {g.options.map((o, j) => (
                    <option
                      key={j}
                      value={o.value}
                      disabled={o.disabled}
                      selected={o.selected}
                    >
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
      );
    case "hidden":
      return (
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
          autoFocus={autofocus}
          autoComplete={autocomplete}
        />
      );
    default:
      return (
        <div className="input">
          <label htmlFor={id}>
            {label}
            {description && <p>{description}</p>}
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
              autoFocus={autofocus}
              autoComplete={autocomplete}
            />
          </label>
        </div>
      );
  }
}
