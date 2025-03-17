import React from "react";
import Input from "./Input";

export default function InputGroup({
  className,
  inputs = [],
  formValues,
  onFormValueChange,
}) {
  return (
    <div className={`${className} input-group`}>
      {inputs.map((input, index) => (
        <Input
          key={index}
          {...input}
          value={formValues[input.name] || ""}
          onChange={(value) => onFormValueChange(input.name, value)}
        />
      ))}
    </div>
  );
}
