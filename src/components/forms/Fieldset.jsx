import React, { useEffect, useState, lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";

const FormGroup = lazy(() => import("./FormGroup"));

import IconButton from "../common/buttons/IconButton";

export default function Fieldset({
  title = "Fieldset",
  formGroups = [],
  paginate = false,
  className,
  formValues,
  onFormValueChange,
  fieldsetPage,
  onFieldsetPageChange,
  formPages,
  onFormPageChange,
  validatePaginate = false,
  formCompletionStatus,
  updateFormCompletionStatus,
}) {
  const [isValid, setIsValid] = useState(false);

  const handleNext = () => {
    if (fieldsetPage < formGroups.length - 1) {
      onFieldsetPageChange(fieldsetPage + 1);
    }
  };

  const handlePrev = () => {
    if (fieldsetPage > 0) {
      onFieldsetPageChange(fieldsetPage - 1);
    }
  };

  useEffect(() => {
    if (paginate) {
      if (validatePaginate) {
        const currentFormGroup = formGroups[fieldsetPage];
        const isValid = currentFormGroup.every((form, formIndex) => {
          return formCompletionStatus[fieldsetPage][formIndex];
        });
        setIsValid(isValid);
      }
    } else {
      setIsValid(true);
    }
  }, [
    formCompletionStatus,
    fieldsetPage,
    formGroups,
    validatePaginate,
    paginate,
  ]);

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
