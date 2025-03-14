import React, { useState, useRef, useEffect } from "react";

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
  autocomplete,
  options,
  checked,
  description,
  optionsGrouped,
}) {
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  let initialValue;

  useEffect(() => {
    setFilteredOptions(options || []);
  }, [options]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(id, inputValue);

    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (optionValue) => {
    onChange(id, optionValue);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isDropdownOpen) {
      const isValid = options.some((option) => option.value === value);
      if (!isValid) {
        e.preventDefault();
        alert("Please select a valid option from the list.");
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }

    return () => {
      document.body.classList.remove("dropdown-open");
    };
  }, [isDropdownOpen]);

  switch (type) {
    case "searchable-dropdown":
      return (
        <div className="input searchable-dropdown-input">
          <label htmlFor={id}>
            {label}
            {description && <p>{description}</p>}
            <input
              type="text"
              id={id}
              name={id}
              value={value || ""}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={handleBlur}
              disabled={disabled}
              required={required}
              readOnly={readonly}
              autoFocus={autofocus}
              autoComplete="off"
              ref={inputRef}
            />
            {isDropdownOpen && filteredOptions.length > 0 && (
              <ul className="dropdown-list">
                {filteredOptions.map((o, i) => (
                  <li
                    key={i}
                    onClick={() => handleOptionClick(o.value)}
                    className="dropdown-item"
                  >
                    {o.label}
                  </li>
                ))}
              </ul>
            )}
          </label>
        </div>
      );
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
            <select
              name={id}
              id={id}
              value={value || ""}
              onChange={(e) => onChange(id, e.target.value)}
              required={required}
              disabled={disabled}
            >
              {optionsGrouped &&
                optionsGrouped.map((g, i) => (
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
              {!optionsGrouped &&
                options.map((o, i) => (
                  <option
                    key={i}
                    value={o.value}
                    disabled={o.disabled}
                    selected={o.selected}
                  >
                    {o.label}
                  </option>
                ))}
            </select>
          </label>
        </div>
      );
    case "multi-select":
      return (
        <div className="input">
          <label htmlFor={id}>
            {label}
            {description && <p>{description}</p>}
            <select
              name={id}
              id={id}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions
                ).map((o) => o.value);
                onChange(id, selectedOptions);
              }}
              required={required}
              disabled={disabled}
            >
              {options.map((o, i) => (
                <option key={i} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
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
