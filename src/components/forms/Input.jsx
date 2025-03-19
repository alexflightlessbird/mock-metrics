import React from "react";

import AntInput from "antd/es/input";
import AntSelect from "antd/es/select";
import AntCheckbox from "antd/es/checkbox";
import AntRadio from "antd/es/radio";
import AntInputNumber from "antd/es/input-number";
import FormItem from "antd/es/form/FormItem";
const { Group: RadioGroup } = AntRadio;

export default function Input({
  className,
  type = "text",
  name,
  label = "Input",
  value,
  onChange,
  options = [],
  multi = false,
  searchable = true,
  disabled = false,
  required = true,
  placeholder,
  autoFocus,
  ...otherProps
}) {
  const handleChange = (e) => {
    if (type === "checkbox") {
      onChange(e.target.checked);
    } else {
      onChange(e.target.value);
    }
  };

  const handleSelectChange = (selectedOption) => {
    if (multi) {
      onChange(selectedOption);
    } else {
      onChange(selectedOption);
    }
  };

  const handleNumberChange = (newValue) => {
    onChange(newValue);
  };

  const selectValue = () => {
    if (multi) {
      return Array.isArray(value) ? value : [];
    }
    return value || undefined;
  };

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <AntSelect
            mode={multi ? "multiple" : undefined}
            value={selectValue()}
            onChange={handleSelectChange}
            options={options.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            disabled={disabled}
            placeholder={placeholder}
            showSearch={true}
            style={{ width: "100%" }}
            dropdownStyle={{ zIndex: 2000 }}
          />
        );
      case "checkbox":
        return (
          <AntCheckbox
            checked={!!value}
            onChange={handleChange}
            disabled={disabled}
            autoFocus={autoFocus}
            {...otherProps}
          />
        );
      case "radio":
        return (
          <RadioGroup
            name={name}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            {...otherProps}
          >
            {options.map((o) => (
              <AntRadio key={o.value} value={o.value}>
                {o.label}
              </AntRadio>
            ))}
          </RadioGroup>
        );
      case "number":
        return (
          <AntInputNumber
            value={value}
            onChange={handleNumberChange}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            {...otherProps}
          />
        );
      case "textarea":
        return (
          <AntInput.TextArea
            value={value || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            {...otherProps}
          />
        );
      default:
        return (
          <AntInput
            type={type}
            name={name}
            value={value || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            autoFocus={autoFocus}
            {...otherProps}
          />
        );
    }
  };

  return (
    <div className={`${className} input`}>
      <FormItem
        name={name}
        label={label}
        validateTrigger="onBlur"
        rules={[{ required: required, message: "Required" }]}
      >
        {renderInput()}
      </FormItem>
    </div>
  );
}
