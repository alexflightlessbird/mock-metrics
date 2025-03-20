import React, { useState, useEffect, lazy, Suspense } from "react";
import IconButton from "../common/buttons/IconButton";
import Spin from "antd/es/spin";
import AntModal from "antd/es/modal";
import Steps from "antd/es/steps";
const { Step } = Steps;
const FieldsetGroup = lazy(() => import("./FieldsetGroup"));

export default function Modal({
  title = "Modal",
  fieldsetGroups = [],
  onClose,
  className,
  isOpen = false,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(0);

  const [formCompletionStatus, setFormCompletionStatus] = useState(
    fieldsetGroups.map((fieldsetGroup) =>
      fieldsetGroup.map((fieldset) =>
        fieldset.formGroups.map((formGroup) => formGroup.map(() => false))
      )
    )
  );

  const updateFormCompletionStatus = (
    fieldsetGroupIndex,
    fieldsetIndex,
    formGroupIndex,
    formIndex,
    isCompleted
  ) => {
    setFormCompletionStatus((prev) => {
      const newStatus = JSON.parse(JSON.stringify(prev));
      newStatus[fieldsetGroupIndex][fieldsetIndex][formGroupIndex][formIndex] =
        isCompleted;
      return newStatus;
    });
  };

  useEffect(() => {
    const currentFieldsetGroup = fieldsetGroups[currentStep];
    const isValid = currentFieldsetGroup.every((fieldset, fieldsetIndex) => {
      return fieldset.formGroups.every((formGroup, formGroupIndex) => {
        return formGroup.every((form, formIndex) => {
          return formCompletionStatus[currentStep][fieldsetIndex][
            formGroupIndex
          ][formIndex];
        });
      });
    });
    setIsValid(isValid);
  }, [formCompletionStatus, currentStep, fieldsetGroups]);

  const handleNext = () => {
    if (currentStep < fieldsetGroups.length - 1)
      setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <AntModal
      className={`${className} modal`}
      title={title}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <IconButton
          key="close"
          onClick={onClose}
          icon="close"
          buttonText="Close Modal"
          className={`${className} handle-controls close-button`}
        />,
      ]}
    >
      {fieldsetGroups.length > 1 && (
        <Steps
          progressDot
          size="small"
          current={currentStep}
          className={`${className} modal-steps steps`}
          responsive={false}
        >
          {fieldsetGroups.map((fieldsetGroup, fieldsetGroupIndex) => (
            <Step
              key={fieldsetGroupIndex}
              title={`Step ${fieldsetGroupIndex + 1}`}
            />
          ))}
        </Steps>
      )}
      <Suspense fallback={<Spin delay={500}/>}>
        <FieldsetGroup
          className={className}
          fieldsetGroup={fieldsetGroups[currentStep]}
          formCompletionStatus={formCompletionStatus[currentStep]}
          updateFormCompletionStatus={(
            fieldsetIndex,
            formGroupIndex,
            formIndex,
            isCompleted
          ) =>
            updateFormCompletionStatus(
              currentStep,
              fieldsetIndex,
              formGroupIndex,
              formIndex,
              isCompleted
            )
          }
        />
      </Suspense>
      <div className={`${className} controls-group modal-controls controls`}>
        {fieldsetGroups.length > 1 && (
          <div
            className={`${className} modal-pagination-controls pagination-controls modal-controls controls`}
          >
            <IconButton
              onClick={handlePrev}
              buttonText="Modal"
              disabled={currentStep === 0}
              icon="back"
            />
            <p
              className={`${className} modal-controls controls page-indicator`}
            >
              <span>
                Page {currentStep + 1} of {fieldsetGroups.length}
              </span>
            </p>
            <IconButton
              onClick={handleNext}
              buttonText="Modal"
              disabled={currentStep === fieldsetGroups.length - 1 || !isValid}
              icon="forward"
              iconPosition="end"
              tooltip={!isValid}
              tooltipText="Submit forms before continuing"
              tooltipPlacement="top"
            />
          </div>
        )}
      </div>
    </AntModal>
  );
}
