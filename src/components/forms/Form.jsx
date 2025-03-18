import React, { useEffect, useState } from "react";
import InputGroup from "./InputGroup";
import icons from "../../utils/icons";
import IconButton from "../common/buttons/IconButton";
import { Form as AntForm, notification, message } from "antd";
import Countdown from "../common/Countdown";

export default function Form({
  title = "Title",
  description = "",
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
  waitTime = 0,
  disableAfterCompletion = true,
}) {
  const [isValid, setIsValid] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [form] = AntForm.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

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
    const lastSubmissionTime = localStorage.getItem(
      `lastSubmissionTime_${title}`
    );
    const currentTime = Date.now();

    if (lastSubmissionTime && waitTime > 0) {
      const timeElapsed = (currentTime - parseInt(lastSubmissionTime)) / 1000;
      if (timeElapsed < waitTime) {
        const timeLeft = waitTime - timeElapsed;
        showCountdownNotification(timeLeft);
        return;
      }
    }

    form
      .validateFields()
      .then(() => {
        onSubmit(formValues);
        updateFormCompletionStatus(true);
        showConfirmationMessage(title);
        handleReset();
        if (waitTime > 0) {
          localStorage.setItem(
            `lastSubmissionTime_${title}`,
            currentTime.toString()
          );
          setTimeout(() => {
            localStorage.removeItem(`lastSubmissionTime_${title}`);
          }, waitTime * 1000);
        }
      })
      .catch((err) => {
        console.log("Validation Failed:", err);
      });
  };

  const showCountdownNotification = (timeLeft) => {
    notificationApi.info({
      message: `Please wait before submitting again`,
      description: (
        <Countdown
          initialSeconds={Math.ceil(timeLeft)}
          onComplete={() => notificationApi.destroy()}
        >
          {(seconds) => `Time remaining: ${seconds} seconds`}
        </Countdown>
      ),
      placement: "topRight",
      duration: 10,
      pauseOnHover: true,
    });
  };

  const showConfirmationMessage = (title) => {
    messageApi.open({
      type: "success",
      content: `Form ${title} has been submitted.`,
    });
  };

  const handleReset = () => {
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

  console.log("UPDATED:", title, formCompletionStatus);
  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
      <AntForm
        form={form}
        onFinish={handleSubmit}
        className={`${className} form`}
      >
        <h3>{title}</h3>
        {description && (
          <p className={`${className} form-description`}>{description}</p>
        )}
        <p>
          Submission Status:{" "}
          {formCompletionStatus ? "Submitted" : "Not yet submitted"}
        </p>
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
              <p
                className={`${className} form-controls controls page-indicator`}
              >
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
            {showSubmitButton &&
              disableAfterCompletion &&
              formCompletionStatus && (
                <IconButton
                  icon={React.createElement(icons.check)}
                  buttonText="Form Submitted"
                  disabled={true}
                  tooltip={true}
                  tooltipPlacement="top"
                  tooltipText="Form has already been submitted"
                  className="submit-button"
                />
              )}
            {(showSubmitButton && !disableAfterCompletion) ||
              (disableAfterCompletion && !formCompletionStatus && (
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
              ))}
          </div>
        </div>
      </AntForm>
    </>
  );
}
