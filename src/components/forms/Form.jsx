import React, { useEffect, useState } from "react";
import InputGroup from "./InputGroup";
import icons from "../../utils/icons";
import IconButton from "../common/buttons/IconButton";
import { Form as AntForm } from "antd";

export default function Form({
  title = "Title",
  inputGroups = [],
  paginate = false,
  onSubmit,
  className,
  formValues,
  onFormValueChange,
  formPage,
  onFormPageChange,
  validatePaginate = false,
  formCompletionStatus,
  updateFormCompletionStatus,
}) {
  const [isValid, setIsValid] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [form] = AntForm.useForm();

  const handleNext = () => {
    if (formPage < inputGroups.length - 1) {
      onFormPageChange(formPage + 1);
    }
  };

  const handlePrev = () => {
    if (formPage > 0) {
      onFormPageChange(formPage - 1);
    }
  };

  const handleInputChange = (name, value) => {
    onFormValueChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        onSubmit(formValues);
        updateFormCompletionStatus(true);
        window.alert(`Form ${title} has been submitted.`);
        form.resetFields();
      })
      .catch((err) => {
        console.log("Validation Failed:", err);
      });
  };

  const handleReset = () => {
    form.resetFields();
    const initialValues = inputGroups.flat().reduce((acc, input) => {
      acc[input.name] = input.default || "";
      return acc;
    }, {});

    Object.keys(initialValues).forEach((key) => {
      onFormValueChange(key, initialValues[key]);
    });
  };

  useEffect(() => {
    if (paginate) {
      if (validatePaginate) {
        const currentInputGroup = inputGroups[formPage];
        const isValid = currentInputGroup.every((input) => {
          if (input.required) {
            return (
              formValues[input.name] !== "" &&
              formValues[input.name] !== undefined &&
              formValues[input.name].length !== 0
            );
          }
          return true;
        });
        setIsValid(isValid);
      }
    } else {
      setIsValid(true);
    }
  }, [formValues, formPage, inputGroups, validatePaginate]);

  useEffect(() => {
    const isSubmitEnabled = inputGroups.flat().every((input) => {
      if (input.required) {
        return (
          formValues[input.name] !== "" &&
          formValues[input.name] !== undefined &&
          formValues[input.name].length !== 0
        );
      }
      return true;
    });
    setSubmitEnabled(isSubmitEnabled);
  }, [formValues, inputGroups]);

  const showSubmitButton =
    !paginate || (paginate && formPage === inputGroups.length - 1);

  return (
    <AntForm
      form={form}
      onFinish={handleSubmit}
      className={`${className} form`}
    >
      <h3>{title}</h3>
      <div className={`${className} input-groups`}>
        {paginate ? (
          <InputGroup
            className={className}
            inputs={inputGroups[formPage]}
            formValues={formValues}
            onFormValueChange={handleInputChange}
          />
        ) : (
          inputGroups.map((inputGroup, inputGroupIndex) => (
            <InputGroup
              key={inputGroupIndex}
              className={className}
              inputs={inputGroup}
              formValues={formValues}
              onFormValueChange={handleInputChange}
            />
          ))
        )}
      </div>
      <div className={`${className} controls-group form-controls controls`}>
        {paginate && (
          <div
            className={`${className} form-pagination-controls pagination-controls form-controls controls`}
          >
            <IconButton
              buttonText="Form"
              onClick={handlePrev}
              disabled={formPage === 0}
              icon={React.createElement(icons.back)}
            />
            <p className={`${className} form-controls controls page-indicator`}>
              <span>
                Page {formPage + 1} of {inputGroups.length}
              </span>
            </p>
            {!showSubmitButton && (
              <IconButton
                onClick={handleNext}
                buttonText="Form"
                disabled={
                  formPage === inputGroups.length - 1 ||
                  (validatePaginate && !isValid)
                }
                icon={React.createElement(icons.forward)}
                iconPosition="end"
                tooltip={validatePaginate && !isValid}
                tooltipPlacement="top"
                tooltipText="Complete all required questions"
              />
            )}
          </div>
        )}
        <div
          className={`${className} form-handle-controls handle-controls controls`}
        >
          <IconButton
            buttonText="Reset Form"
            onClick={handleReset}
            icon={React.createElement(icons.refresh)}
            className="reset-button"
          />
          {showSubmitButton && (
            <IconButton
              icon={React.createElement(icons.check)}
              buttonText="Submit Form"
              onClick={handleSubmit}
              disabled={!submitEnabled}
              tooltip={!submitEnabled}
              tooltipPlacement="top"
              tooltipText="Complete all required questions"
              className="submit-button"
            />
          )}
        </div>
      </div>
    </AntForm>
  );
}
