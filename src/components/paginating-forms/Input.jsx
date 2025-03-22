import React from "react";
import AntInput from "antd/es/input";
import AntSelect from "antd/es/select";
import AntCheckbox from "antd/es/checkbox";
import AntRadio from "antd/es/radio";
import AntInputNumber from "antd/es/input-number";
import FormItem from "antd/es/form/FormItem";
const { Group: RadioGroup } = AntRadio;
const { Group: CheckboxGroup } = AntCheckbox;

export default function Input({
  className,
  type = "text",
  name,
  label = "Input",
  options = [],
  multi = false,
  searchable = true,
  disabled = false,
  required = true,
  rules = [],
  ...otherProps
}) {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <AntSelect
            mode={multi ? "multiple" : undefined}
            options={options.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            disabled={disabled}
            showSearch={searchable}
            style={{ width: "100%" }}
            dropdownStyle={{ zIndex: 2000 }}
            {...otherProps}
          />
        );
      case "checkbox":
        return (
          <FormItem
            name={name}
            label={label}
            validateTrigger="onChange"
            rules={[
              {
                validator: (_, value) => {
                  if (required && (!value || value.length === 0)) {
                    return Promise.reject(
                      new Error("Please select at least one option")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <CheckboxGroup
              options={options.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              disabled={disabled}
              {...otherProps}
            />
          </FormItem>
        );
      case "radio":
        return (
          <RadioGroup name={name} disabled={disabled} {...otherProps}>
            {options.map((o) => (
              <AntRadio key={o.value} value={o.value}>
                {o.label}
              </AntRadio>
            ))}
          </RadioGroup>
        );
      case "number":
        return (
          <AntInputNumber name={name} disabled={disabled} {...otherProps} />
        );
      case "textarea":
        return (
          <AntInput.TextArea name={name} disabled={disabled} {...otherProps} />
        );
      default:
        return (
          <AntInput
            type={type}
            name={name}
            disabled={disabled}
            {...otherProps}
          />
        );
    }
  };

  return (
    <div className={`${className} input`}>
      {type !== "checkbox" ? (
        <FormItem
          name={name}
          label={label}
          validateTrigger="onBlur"
          rules={[...rules, { required: required, message: "Required" }]}
        >
          {renderInput()}
        </FormItem>
      ) : (
        renderInput()
      )}
    </div>
  );
}
