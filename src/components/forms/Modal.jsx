import { Modal as AntModal } from "antd";
import React, { useState, useEffect } from "react";
import FieldsetGroup from "./FieldsetGroup";
import icons from "../../utils/icons";
import IconButton from "../common/buttons/IconButton";

export default function Modal({
  fieldsetGroups,
  paginate,
  onClose,
  className,
  validatePaginate = false,
  isOpen,
}) {
  const getInitialFormValues = (fieldsetGroups) => {
    const initialValues = {};

    fieldsetGroups.forEach((fieldsetGroup) => {
      fieldsetGroup.forEach((fieldset) => {
        fieldset.formGroups.forEach((formGroup) => {
          formGroup.forEach((form) => {
            form.inputGroups.forEach((inputGroup) => {
              inputGroup.forEach((input) => {
                if (input.type === "checkbox") {
                  initialValues[input.name] = input.default || false;
                } else if (input.type === "radio") {
                  initialValues[input.name] = input.default || "";
                } else if (input.type === "select" && input.multi) {
                  initialValues[input.name] = input.default || [];
                } else {
                  initialValues[input.name] = input.default || "";
                }
              });
            });
          });
        });
      });
    });

    return initialValues;
  };

  const [formValues, setFormValues] = useState(
    getInitialFormValues(fieldsetGroups)
  );

  const [isValid, setIsValid] = useState(false);

  const handleFormValueChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const [dialogPage, setDialogPage] = useState(0);
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

  useEffect(() => {
    if (paginate) {
      if (validatePaginate) {
        const currentFieldsetGroup = fieldsetGroups[dialogPage];
        const isValid = currentFieldsetGroup.every((fieldset) => {
          return fieldset.formGroups.every((formGroup) => {
            return formGroup.every((form) => {
              return form.inputGroups.every((inputGroup) => {
                return inputGroup.every((input) => {
                  if (input.required) {
                    return (
                      formValues[input.name] !== "" &&
                      formValues[input.name] !== undefined
                    );
                  }
                  return true;
                });
              });
            });
          });
        });
        setIsValid(isValid);
      }
    } else {
      setIsValid(true);
    }
  }, [formValues, dialogPage, fieldsetGroups, validatePaginate]);

  const handleNext = () => {
    if (dialogPage < fieldsetGroups.length - 1) {
      setDialogPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (dialogPage > 0) {
      setDialogPage((prev) => prev - 1);
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
      title="Modal"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <IconButton
          key="close"
          onClick={onClose}
          icon={React.createElement(icons.close)}
          buttonText="Close Dialog"
          //className={`${className} handle-controls close-button`}
        />,
      ]}
    >
      {paginate ? (
        <FieldsetGroup
          className={className}
          formValues={formValues}
          onFormValueChange={handleFormValueChange}
          fieldsetGroup={[fieldsetGroups[dialogPage]]}
          fieldsetPages={fieldsetPages[dialogPage]}
          onFieldsetPageChange={(fieldsetIndex, newPage) =>
            handleFieldsetPageChange(dialogPage, fieldsetIndex, newPage)
          }
          formPages={formPages[dialogPage]}
          onFormPageChange={(
            fieldsetIndex,
            formGroupIndex,
            formIndex,
            newPage
          ) =>
            handleFormPageChange(
              dialogPage,
              fieldsetIndex,
              formGroupIndex,
              formIndex,
              newPage
            )
          }
        />
      ) : (
        fieldsetGroups.map((fieldsetGroup, index) => (
          <FieldsetGroup
            key={index}
            className={className}
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
            fieldsetGroup={fieldsetGroup}
            fieldsetPages={fieldsetPages[index]}
            onFieldsetPageChange={(fieldsetIndex, newPage) =>
              handleFieldsetPageChange(index, fieldsetIndex, newPage)
            }
            formPages={formPages[index]}
            onFormPageChange={(
              fieldsetIndex,
              formGroupIndex,
              formIndex,
              newPage
            ) =>
              handleFormPageChange(
                index,
                fieldsetIndex,
                formGroupIndex,
                formIndex,
                newPage
              )
            }
          />
        ))
      )}
      <div className={`${className} controls-group dialog-controls controls`}>
        {paginate && (
          <div
            className={`${className} dialog-pagination-controls pagination-controls dialog-controls controls`}
          >
            <IconButton
              onClick={handlePrev}
              buttonText="Dialog"
              disabled={dialogPage === 0}
              icon={React.createElement(icons.back)}
            />
            <p
              className={`${className} dialog-controls controls page-indicator`}
            >
              <span>
                Page {dialogPage + 1} of {fieldsetGroups.length}
              </span>
            </p>
            <IconButton
              onClick={handleNext}
              buttonText="Dialog"
              disabled={
                dialogPage === fieldsetGroups.length - 1 ||
                (validatePaginate && !isValid)
              }
              icon={React.createElement(icons.forward)}
              iconPosition="end"
              tooltip={validatePaginate && !isValid}
              tooltipText="Complete all required questions"
              tooltipPlacement="top"
            />
          </div>
        )}
      </div>
    </AntModal>
  );
}
