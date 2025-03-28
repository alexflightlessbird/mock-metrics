import { useEffect, useState, lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
import AntForm from "antd/es/form";
import notification from "antd/es/notification";
import message from "antd/es/message";
import Steps from "antd/es/steps";
const { Step } = Steps;
import IconButton from "../../common/components/NewIconButton";
const InputGroup = lazy(() => import("./InputGroup"));
const Countdown = lazy(() => import("../../common/components/Countdown"));

function getInitialFormValues(inputGroups) {
  const initialValues = {};
  inputGroups.forEach((inputGroup) => {
    inputGroup.forEach((input) => {
      if (input.type === "checkbox")
        initialValues[input.name] = input.default || false;
      else if (input.type === "select" && input.multi)
        initialValues[input.name] = input.default || [];
      else initialValues[input.name] = input.default || "";
    });
  });
  return initialValues;
}

export default function Form({
  title = "Title",
  description = "",
  inputGroups = [],
  onSubmit,
  className,
  showMessage = true,
  showSubmit = true,
  formCompletionStatus,
  updateFormCompletionStatus,
  waitTime = 0,
  disableAfterCompletion = true,
  paginationButtonText = "Page",
}) {
  const initialValues = getInitialFormValues(inputGroups);
  const [formValues, setFormValues] = useState(initialValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [form] = AntForm.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        setFormValues((prev) => ({ ...prev, ...values }));
        if (currentStep < inputGroups.length - 1)
          setCurrentStep((prev) => prev + 1);
      })
      .catch(() => showErrorMessage("continuing"));
  };

  const handlePrev = () => {
    const currentValues = form.getFieldsValue();
    setFormValues((prev) => ({ ...prev, ...currentValues }));
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleFailedSubmit = () => {
    showErrorMessage();
  };

  const handleSubmit = () => {
    form.validateFields({ validateOnly: true }).then((values) => {
      const finalValues = { ...formValues, ...values };

      const currentTime = Date.now();
      if (waitTime > 0) {
        const lastSubmissionTime = localStorage.getItem(
          `lastSubmissionTime_${title}`
        );
        if (lastSubmissionTime) {
          const timeElapsed =
            (currentTime - parseInt(lastSubmissionTime)) / 1000;
          if (timeElapsed < waitTime) {
            const timeLeft = waitTime - timeElapsed;
            showCountdownNotification(timeLeft);
            return;
          }
        }
      }
      onSubmit(finalValues);
      updateFormCompletionStatus(true);
      showMessage ? showConfirmationMessage(title) : null;
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
    });
  };

  const showCountdownNotification = (timeLeft) => {
    notificationApi.info({
      message: "Please wait before submitting again",
      description: (
        <Suspense fallback={<Skeleton active />}>
          <Countdown
            initialSeconds={Math.ceil(timeLeft)}
            onComplete={() => notificationApi.destroy()}
          >
            {(seconds) => `Time remaining: ${seconds} seconds`}
          </Countdown>
        </Suspense>
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

  const showErrorMessage = (action = "submitting") => {
    messageApi.open({
      type: "error",
      content: `Please satisfy all form requirements before ${action}.`,
    });
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
    setCurrentStep(0);
  };

  const values = AntForm.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmitEnabled(true))
      .catch(() => {
        // Check if the form has any errors other than non-required checkbox groups
        const fields = form.getFieldsError();
        const hasErrors = fields.some((field) => {
          if (field.errors.length > 0) {
            // Ignore errors for non-required checkbox groups
            const fieldValue = form.getFieldValue(field.name);
            const isCheckboxGroup = Array.isArray(fieldValue);
            const isRequired = form.getFieldInstance(field.name)?.props
              ?.required;
            return !(isCheckboxGroup && !isRequired);
          }
          return false;
        });
        setSubmitEnabled(!hasErrors);
      });
  }, [values, inputGroups, form]);

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
        <div className="form-steps-title">
          {title !== "" && <h3>{title}</h3>}
          {inputGroups.length > 1 && (
            <Steps
              progressDot
              size="small"
              current={currentStep}
              className={`${className} form-steps steps`}
              responsive={false}
            >
              {inputGroups.map((inputGroup, inputGroupIndex) => (
                <Step
                  key={inputGroupIndex}
                  title={`Step ${inputGroupIndex + 1}`}
                />
              ))}
            </Steps>
          )}
        </div>
        {description && (
          <p className={`${className} form-description`}>{description}</p>
        )}
        {showSubmit && (
          <p>
            Submission Status:{" "}
            {formCompletionStatus ? "Submitted" : "Not yet submitted"}
          </p>
        )}
        <Suspense fallback={<Skeleton active />}>
          <InputGroup
            className={className}
            inputGroup={inputGroups[currentStep]}
          />
        </Suspense>
        <div className={`${className} controls-group form-controls controls`}>
          {inputGroups.length > 1 && (
            <div
              className={`${className} form-pagination-controls pagination-controls form-controls controls`}
            >
              <IconButton
                onClick={handlePrev}
                buttonText={paginationButtonText}
                disabled={currentStep === 0}
                icon="back"
              />
              <p
                className={`${className} form-controls controls page-indicator`}
              >
                <span>
                  Page {currentStep + 1} of {inputGroups.length}
                </span>
              </p>
              <IconButton
                onClick={handleNext}
                buttonText={paginationButtonText}
                disabled={currentStep === inputGroups.length - 1}
                icon="forward"
                iconPosition="end"
              />
            </div>
          )}
          <div
            className={`${className} form-handle-controls handle-controls controls`}
          >
            <IconButton
              buttonText="Reset"
              onClick={handleReset}
              icon="refresh"
              className="reset-button"
            />
            {showSubmitButton &&
              disableAfterCompletion &&
              formCompletionStatus && (
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
            {showSubmitButton &&
              (!disableAfterCompletion ||
                (disableAfterCompletion && !formCompletionStatus)) && (
                <IconButton
                  icon="check"
                  buttonText="Submit"
                  disabled={!submitEnabled}
                  tooltip={!submitEnabled}
                  tooltipPlacement="top"
                  tooltipText="Complete all required questions"
                  className="submit-button"
                  type="submit"
                />
              )}
          </div>
        </div>
      </AntForm>
    </>
  );
}
