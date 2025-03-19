import React, { useState, useEffect, lazy, Suspense } from "react";
import IconButton from "../common/buttons/IconButton";
import Spin from "antd/es/spin";

import AntModal from "antd/es/modal";

const FieldsetGroup = lazy(() => import("./FieldsetGroup"));

function getInitialFormValues (fieldsetGroups) {
  const initialValues = {};
  fieldsetGroups.forEach((fieldsetGroup) => {
    fieldsetGroup.forEach((fieldset) => {
      fieldset.formGroups.forEach((formGroup) => {
        formGroup.forEach((form) => {
          form.inputGroups.forEach((inputGroup) => {
            inputGroup.forEach((input) => {
              if (input.type === "checkbox") initialValues[input.name] = input.default || false;
              else if (input.type === "radio") initialValues[input.name] = input.default || "";
              else if (input.type === "select" && input.multi) initialValues[input.name] = input.default || [];
              else initialValues[input.name] = input.default || "";
            })
          })
        })
      })
    })
  })
  return initialValues;
}

export default function Modal({
  title = "Modal",
  fieldsetGroups,
  paginate = false,
  onClose,
  className,
  validatePaginate = false,
  isOpen = false,
}) {
  const [formValues, setFormValues] = useState(
    getInitialFormValues(fieldsetGroups)
  );
  const [isValid, setIsValid] = useState(false);

  const [formCompletionStatus, setFormCompletionStatus] = useState(
    fieldsetGroups.map((fieldsetGroup) =>
      fieldsetGroup.map((fieldset) =>
        fieldset.formGroups.map((formGroup) => formGroup.map(() => false))
      )
    )
  );

  const handleFormValueChange = (name, value) => {
    if (Array.isArray(name)) {
      setFormValues((prev) => ({
        ...prev,
        [name[0]]: { ...prev[name[0]], [name[1]]: value },
      }));
    }
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const [modalPage, setModalPage] = useState(0);
  const [fieldsetPages, setFieldsetPages] = useState(
    fieldsetGroups.map((fieldsetGroup) => fieldsetGroup.map(() => 0))
  );

  const [formPages, setFormPages] = useState(
    fieldsetGroups.map((fieldsetGroup) =>
      fieldsetGroup.map((fieldset) =>
        fieldset.formGroups.map((formGroup) => formGroup.map(() => 0))
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
    if (paginate) {
      if (validatePaginate) {
        const currentFieldsetGroup = fieldsetGroups[modalPage];
        const isValid = currentFieldsetGroup.every(
          (fieldset, fieldsetIndex) => {
            return fieldset.formGroups.every((formGroup, formGroupIndex) => {
              return formGroup.every((form, formIndex) => {
                return formCompletionStatus[modalPage][fieldsetIndex][
                  formGroupIndex
                ][formIndex];
              });
            });
          }
        );
        setIsValid(isValid);
      }
    } else {
      setIsValid(true);
    }
  }, [formCompletionStatus, modalPage, fieldsetGroups, validatePaginate]);

  const handleNext = () => {
    if (modalPage < fieldsetGroups.length - 1) {
      setModalPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (modalPage > 0) {
      setModalPage((prev) => prev - 1);
    }
  };

  const handleFieldsetPageChange = (
    fieldsetGroupIndex,
    fieldsetIndex,
    newPage
  ) => {
    setFieldsetPages((prev) => {
      const newFieldsetPages = [...prev];
      newFieldsetPages[fieldsetGroupIndex][fieldsetIndex] = newPage;
      return newFieldsetPages;
    });
  };

  const handleFormPageChange = (
    fieldsetGroupIndex,
    fieldsetIndex,
    formGroupIndex,
    formIndex,
    newPage
  ) => {
    setFormPages((prev) => {
      const newFormPages = [...prev];
      newFormPages[fieldsetGroupIndex][fieldsetIndex][formGroupIndex][
        formIndex
      ] = newPage;
      return newFormPages;
    });
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
          //className={`${className} handle-controls close-button`}
        />,
      ]}
    >
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
