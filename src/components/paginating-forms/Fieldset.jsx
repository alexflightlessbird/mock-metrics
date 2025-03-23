import React, { useEffect, useState, lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
import Steps from "antd/es/steps";
const { Step } = Steps;
import IconButton from "../common/buttons/IconButton";
const FormGroup = lazy(() => import("./FormGroup"));

export default function Fieldset({
  title = "",
  formGroups = [],
  className,
  formCompletionStatus,
  updateFormCompletionStatus,
  paginationButtonText = "Set of Forms",
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const currentFormGroup = formGroups[currentStep];
    const isValid = currentFormGroup.every((form, formIndex) => {
      return formCompletionStatus[currentStep][formIndex];
    });
    setIsValid(isValid);
  }, [formCompletionStatus, currentStep, formGroups]);

  const handleNext = () => {
    if (currentStep < formGroups.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <fieldset className={`${className} fieldset`}>
      <div className="fieldset-steps-title">
        {title !== "" && <legend>{title}</legend>}
        {formGroups.length > 1 && (
          <Steps
            progressDot
            size="small"
            current={currentStep}
            className={`${className} fieldset-steps steps`}
            responsive={false}
          >
            {formGroups.map((formGroup, formGroupIndex) => (
              <Step key={formGroupIndex} title={`Step ${formGroupIndex + 1}`} />
            ))}
          </Steps>
        )}
      </div>
      <Suspense fallback={<Skeleton active />}>
        <FormGroup
          className={className}
          formGroup={formGroups[currentStep]}
          formCompletionStatus={formCompletionStatus[currentStep]}
          updateFormCompletionStatus={(formIndex, isCompleted) =>
            updateFormCompletionStatus(currentStep, formIndex, isCompleted)
          }
        />
      </Suspense>
      <div className={`${className} controls-group fieldset-controls controls`}>
        {formGroups.length > 1 && (
          <div
            className={`${className} fieldset-pagination-controls pagination-controls fieldset-controls controls`}
          >
            <IconButton
              onClick={handlePrev}
              buttonText={paginationButtonText}
              disabled={currentStep === 0}
              icon="back"
            />
            <p
              className={`${className} fieldset-controls controls page-indicator`}
            >
              <span>
                Page {currentStep + 1} of {formGroups.length}
              </span>
            </p>
            <IconButton
              onClick={handleNext}
              buttonText={paginationButtonText}
              disabled={currentStep === formGroups.length - 1 || !isValid}
              icon="forward"
              iconPosition="end"
              tooltip={!isValid}
              tooltipText="Submit forms before continuing"
              tooltipPlacement="top"
            />
          </div>
        )}
      </div>
    </fieldset>
  );
}
