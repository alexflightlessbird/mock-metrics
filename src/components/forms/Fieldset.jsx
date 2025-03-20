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
        <legend>{title}</legend>
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
              buttonText="Fieldset"
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
              buttonText="Fieldset"
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

/*
  return (
    <fieldset className={`${className} fieldset`}>
      <legend>{title}</legend>
      <div className={`${className} form-groups`}>
        <Suspense fallback={<Skeleton active />}>
          {paginate ? (
            <FormGroup
              className={className}
              formGroup={formGroups[fieldsetPage]}
              formValues={formValues}
              onFormValueChange={onFormValueChange}
              formPages={formPages[fieldsetPage]}
              onFormPageChange={(formIndex, newPage) =>
                onFormPageChange(fieldsetPage, formIndex, newPage)
              }
              formCompletionStatus={formCompletionStatus[fieldsetPage]}
              updateFormCompletionStatus={(formIndex, isCompleted) =>
                updateFormCompletionStatus(fieldsetPage, formIndex, isCompleted)
              }
            />
          ) : (
            formGroups.map((formGroup, formGroupIndex) => (
              <FormGroup
                key={formGroupIndex}
                className={className}
                formGroup={formGroup}
                formValues={formValues}
                onFormValueChange={onFormValueChange}
                formPages={formPages[formGroupIndex]}
                onFormPageChange={(formIndex, newPage) =>
                  onFormPageChange(formGroupIndex, formIndex, newPage)
                }
                formCompletionStatus={formCompletionStatus[formGroupIndex]}
                updateFormCompletionStatus={(formIndex, isCompleted) =>
                  updateFormCompletionStatus(
                    formGroupIndex,
                    formIndex,
                    isCompleted
                  )
                }
              />
            ))
          )}
        </Suspense>
      </div>
      <div className={`${className} controls-group`}>
        {paginate && (
          <div
            className={`${className} fieldset-pagination-controls pagination-controls fieldset-controls controls`}
          >
            <IconButton
              onClick={handlePrev}
              buttonText="Fieldset"
              disabled={fieldsetPage === 0}
              icon="back"
            />
            <p
              className={`${className} fieldset-controls controls page-indicator`}
            >
              <span>
                Page {fieldsetPage + 1} of {formGroups.length}
              </span>
            </p>
            <IconButton
              onClick={handleNext}
              buttonText="Fieldset"
              disabled={
                fieldsetPage === formGroups.length - 1 ||
                (validatePaginate && !isValid)
              }
              icon="forward"
              iconPosition="end"
              tooltip={validatePaginate && !isValid}
              tooltipText="Submit forms before continuing"
              tooltipPlacement="top"
            />
          </div>
        )}
      </div>
    </fieldset>
  );
}
*/
