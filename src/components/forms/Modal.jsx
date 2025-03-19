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

  const updateFormCompletionStatus = (fieldsetGroupIndex, fieldsetIndex, formGroupIndex, formIndex, isCompleted) => {
    setFormCompletionStatus((prev) => {
      const newStatus = JSON.parse(JSON.stringify(prev));
      newStatus[fieldsetGroupIndex][fieldsetIndex][formGroupIndex][formIndex] = isCompleted;
      return newStatus;
    })
  }

  useEffect(() => {
    const currentFieldsetGroup = fieldsetGroups[currentStep];
    const isValid = currentFieldsetGroup.every((fieldset, fieldsetIndex) => {
      return fieldset.formGroups.every((formGroup, formGroupIndex) => {
        return formGroup.every((form, formIndex) => {
          return formCompletionStatus[currentStep][fieldsetIndex][formGroupIndex][formIndex];
        })
      })
    })
    setIsValid(isValid);
  }, [formCompletionStatus, currentStep, fieldsetGroups]);

  const handleNext = () => {
    if (currentStep < fieldsetGroups.length - 1) setCurrentStep((prev) => prev + 1);
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

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
        />
      ]}
    >
      <Steps current={currentStep}>
        {fieldsetGroups.map((fieldsetGroup, fieldsetGroupIndex) => (
          <Step key={fieldsetGroupIndex} title={`Step ${fieldsetGroupIndex + 1}`} />
        ))}
      </Steps>
      <Suspense fallback={<Spin />}>
        <FieldsetGroup
          className={className}
          fieldsetGroup={fieldsetGroups[currentStep]}
          formCompletionStatus={formCompletionStatus[currentStep]}
          updateFormCompletionStatus={(fieldsetIndex, formGroupIndex, formIndex, isCompleted) => updateFormCompletionStatus(currentStep, fieldsetIndex, formGroupIndex, formIndex, isCompleted)}
        />
      </Suspense>
      <div className={`${className} controls-group modal-controls controls`}>
        <div className={`${className} modal-pagination-controls pagination-controls modal-controls controls`}>
          <IconButton 
            onClick={handlePrev}
            buttonText="Modal"
            disabled={currentStep === 0}
            icon="back"
          />
          <p className={`${className} modal-controls controls page-indicator`}><span>Page {currentStep + 1} of {fieldsetGroups.length}</span></p>
          <IconButton 
            onclick={handleNext}
            buttonText="Modal"
            disabled={currentStep === fieldsetGroups.length - 1 || !isValid}
            icon="forward"
            iconPosition="end"
            tooltip={!isValid}
            tooltipText="Submit forms before continuing"
            tooltipPlacement="top"
          />
        </div>
      </div>
    </AntModal>
  )
}

/*
  return (
      <Suspense fallback={<Spin />}>
        {paginate ? (
          <FieldsetGroup
            className={className}
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
            fieldsetGroup={[fieldsetGroups[modalPage]]}
            fieldsetPages={fieldsetPages[modalPage]}
            onFieldsetPageChange={(fieldsetIndex, newPage) =>
              handleFieldsetPageChange(modalPage, fieldsetIndex, newPage)
            }
            formPages={formPages[modalPage]}
            onFormPageChange={(
              fieldsetIndex,
              formGroupIndex,
              formIndex,
              newPage
            ) =>
              handleFormPageChange(
                modalPage,
                fieldsetIndex,
                formGroupIndex,
                formIndex,
                newPage
              )
            }
            formCompletionStatus={formCompletionStatus[modalPage]}
            updateFormCompletionStatus={(
              fieldsetIndex,
              formGroupIndex,
              formIndex,
              isCompleted
            ) =>
              updateFormCompletionStatus(
                modalPage,
                fieldsetIndex,
                formGroupIndex,
                formIndex,
                isCompleted
              )
            }
          />
        ) : (
          fieldsetGroups.map((fieldsetGroup, fieldsetGroupIndex) => {
            <FieldsetGroup
              key={fieldsetGroupIndex}
              className={className}
              formValues={formValues}
              onFormValueChange={handleFormValueChange}
              fieldsetGroup={fieldsetGroup}
              fieldsetPages={fieldsetPages[fieldsetGroupIndex]}
              onFieldsetPageChange={(fieldsetIndex, newPage) =>
                handleFieldsetPageChange(
                  fieldsetGroupIndex,
                  fieldsetIndex,
                  newPage
                )
              }
              formPages={formPages[fieldsetGroupIndex]}
              onFormPageChange={(
                fieldsetIndex,
                formGroupIndex,
                formIndex,
                newPage
              ) =>
                handleFormPageChange(
                  fieldsetGroupIndex,
                  fieldsetIndex,
                  formGroupIndex,
                  formIndex,
                  newPage
                )
              }
              formCompletionStatus={formCompletionStatus[fieldsetGroupIndex]}
              updateFormCompletionStatus={(
                fieldsetIndex,
                formGroupIndex,
                formIndex,
                isCompleted
              ) =>
                updateFormCompletionStatus(
                  fieldsetGroupIndex,
                  fieldsetIndex,
                  formGroupIndex,
                  formIndex,
                  isCompleted
                )
              }
            />;
          })
        )}
      </Suspense>
      <div className={`${className} controls-group modal-controls controls`}>
        {paginate && (
          <div
            className={`${className} modal-pagination-controls pagination-controls modal-controls controls`}
          >
            <IconButton
              onClick={handlePrev}
              buttonText="Modal"
              disabled={modalPage === 0}
              icon="back"
            />
            <p
              className={`${className} modal-controls controls page-indicator`}
            >
              <span>
                Page {modalPage + 1} of {fieldsetGroups.length}
              </span>
            </p>
            <IconButton
              onClick={handleNext}
              buttonText="Modal"
              disabled={
                modalPage === fieldsetGroups.length - 1 ||
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
    </AntModal>
  );
}
*/