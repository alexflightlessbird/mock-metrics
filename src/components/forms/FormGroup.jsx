import React from "react";
import Form from "./Form";

export default function FormGroup({
  className,
  formGroup = [],
  formValues,
  onFormValueChange,
  formPages,
  onFormPageChange,
}) {
  return (
    <div className={`${className} form-group`}>
      {formGroup.map((form, index) => (
        <React.Fragment key={index}>
          <Form
            {...form}
            formValues={formValues}
            onFormValueChange={onFormValueChange}
            formPage={formPages[index]}
            onFormPageChange={(newPage) => onFormPageChange(index, newPage)}
          />
          {index < formGroup.length - 1 && <hr />}
        </React.Fragment>
      ))}
      <hr className="divider divider-transparent divider-stopper" />
    </div>
  );
}
