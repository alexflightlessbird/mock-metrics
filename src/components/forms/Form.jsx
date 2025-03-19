import React, { useEffect, useState, lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
import AntForm from "antd/es/form";
import Input from "antd/es/input";
import notification from "antd/es/notification";
import message from "antd/es/message";
import Steps from "antd/es/steps";
const { Step } = Steps;
import IconButton from "../common/buttons/IconButton";
const InputGroup = lazy(() => import("./InputGroup"));
const Countdown = lazy(() => import("../common/Countdown"));

function getInitialFormValues (inputGroups) {
  const initialValues = {};
  inputGroups.forEach((inputGroup) => {
    inputGroup.forEach((input) => {
      if (input.type === "checkbox") initialValues[input.name] = input.default || false;
      else if (input.type === "select" && input.multi) initialValues[input.name] = input.default || [];
      else initialValues[input.name] = input.default || "";
    })
  })
  return initialValues;
}

export default function Form({
  title = "Title",
  description = "",
  inputGroups = [],
  onSubmit,
  className,
  formCompletionStatus,
  updateFormCompletionStatus,
  waitTime = 0,
  disableAfterCompletion = true,
}) {
  const initialValues = getInitialFormValues(inputGroups);
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [form] = AntForm.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    const currentInputGroup = inputGroups[currentStep];
    const isValid = currentInputGroup.every((input, inputIndex) => {
      if (input.required) {
        return (
          formValues[input.name] !== "" &&
          formValues[input.name] !== undefined &&
          formValues[input.name].length !== 0
        )
      }
      return true;
    })
    setIsValid(isValid);
  }, [formValues, currentStep, inputGroups]);


  const handleNext = () => {
    if (currentStep < inputGroups.legnth - 1) setCurrentStep((prev) => prev + 1);
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

  const handleFailedSubmit = (values) => {
    showErrorMessage();
  }

  const handleSubmit = (values) => {
    if (waitTime > 0) {
      const lastSubmissionTime = localStorage.getItem(`lastSubmissionTime_${title}`);
      const currentTime = Date.now();
      if (lastSubmissionTime) {
        const timeElapsed = (currentTime - parseInt(lastSubmissionTime)) / 1000;
        if (timeElapsed < waitTime) {
          const timeLeft = waitTime - timeElapsed;
          showCountdownNotification(timeLeft);
          return;
        }
      }
    }
    onSubmit(values);
    updateFormCompletionStatus(true);
    showConfirmationMessage(title);
    handleReset();
    if (waitTime > 0) {
      localStorage.setItem(`lastSubmissionTime_${title}`, currentTime.toString());
      setTimeout(() => {
        localStorage.removeItem(`lastSubmissionTime_${title}`);
      }, waitTime * 1000);
    }
  }

  const showCountdownNotification = (timeLeft) => {
    notificationApi.info({
      message: "Please wait before submitting again",
      description: (
        <Suspense fallback={<Skeleton active />}>
          <Countdown initialSeconds={Math.ceil(timeLeft)} onComplete={() => notificationApi.destroy()}>
            {(seconds) => `Time remaining: ${seconds} seconds`}
          </Countdown>
        </Suspense>
      ),
      placement: "topRight",
      duration: 10,
      pauseOnHover: true
    })
  }

  const showConfirmationMessage = (title) => {
    messageApi.open({
      type: "success",
      content: `Form ${title} has been submitted.`,
    })
  }

  const showErrorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Please satisfy all form requirements before submitting."
    })
  }

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
  }

  const values = AntForm.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(setSubmitEnabled(true))
      .catch(setSubmitEnabled(false));
  }, [values, inputGroups]);

  const showSubmitButton = currentStep === inputGroups.length - 1;

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
      <AntForm
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={handleFailedSubmit}
        className={`${className} form`}
        initialValues={initialValues}
      >
        <h3>{title}</h3>
        {description && (<p className={`${className} form-description`}>{description}</p>)}
        <p>Submission Status: {formCompletionStatus ? "Submitted" : "Not yet submitted"}</p>
        <Steps current={currentStep}>
          {inputGroups.map((inputGroup, inputGroupIndex) => (
            <Step key={inputGroupIndex} title={`Step ${inputGroupIndex + 1}`} />
          ))}
        </Steps>
        <Suspense fallback={<Skeleton active />}>
          <InputGroup
            className={className}
            inputGroup={inputGroups[currentStep]}
          />
        </Suspense>
        <div className={`${className} controls-group form-controls controls`}>
          <div className={`${className} form-pagination-controls pagination-controls form-controls controls`}>
            <IconButton
              onClick={handlePrev}
              buttonText="Form"
              disabled={currentStep === 0}
              icon="back"
            />
            <p className={`${className} form-controls controls page-indicator`}><span>Page {currentStep + 1} of {inputGroups.length}</span></p>
            <IconButton
              onClick={handleNext}
              buttonText="Form"
              disabled={currentStep === inputGroups.length - 1 || !isValid}
              icon="forward"
              iconPosition="end"
              tooltip={!isValid}
              tooltipText="Finish all questions before continuing"
              tooltipPlacement="top"
            />
          </div>
          <div className={`${className} form-handle-controls handle-controls controls`}>
            <IconButton
              buttonText="Reset Form"
              onClick={handleReset}
              icon="refresh"
              className="reset-button"
            />
            {showSubmitButton && disableAfterCompletion && formCompletionStatus && (
              <IconButton
                icon="check"
                buttonText="Form Submitted"
                disabled={true}
                tooltip={true}
                tooltipPlacement="top"
                tooltipText="Form has already been submitted"
                className="submit-button"
              />
            )}
            {showSubmitButton && (!disableAfterCompletion || (disableAfterCompletion && !formCompletionStatus)) && (
              <IconButton
                icon="check"
                buttonText="Submit Form"
                disabled={!submitEnabled}
                tooltip={!submitEnabled}
                tooltipPlacement="top"
                tooltipText="Complete all required questions"
                className="submit-button"
                htmlType="submit"
              />
            )}
          </div>
        </div>
      </AntForm>
    </>
  )
}