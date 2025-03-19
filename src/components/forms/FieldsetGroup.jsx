import React, { lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
const Fieldset = lazy(() => import("./Fieldset"));

export default function FieldsetGroup({
  className,
  fieldsetGroup,
  formValues,
  onFormValueChange,
  fieldsetPages,
  onFieldsetPageChange,
  formPages,
  onFormPageChange,
  formCompletionStatus,
  updateFormCompletionStatus,
}) {
  return (
    <div className={`${className} fieldset-groups`}>
      {fieldsetGroup.map((fieldsetGroup, fieldsetGroupIndex) => (
        <div key={fieldsetGroupIndex} className={`${className} fieldset-group`}>
          <Suspense fallback={<Skeleton active />}>
            {fieldsetGroup.map((fieldset, fieldsetIndex) => (
              <React.Fragment key={fieldsetIndex}>
                <Fieldset
                  key={fieldsetIndex}
                  className={className}
                  {...fieldset}
                  formValues={formValues}
                  onFormValueChange={onFormValueChange}
                  fieldsetPage={fieldsetPages[fieldsetIndex]}
                  onFieldsetPageChange={(newPage) =>
                    onFieldsetPageChange(fieldsetIndex, newPage)
                  }
                  formPages={formPages[fieldsetIndex]}
                  onFormPageChange={(formGroupIndex, formIndex, newPage) =>
                    onFormPageChange(
                      fieldsetIndex,
                      formGroupIndex,
                      formIndex,
                      newPage
                    )
                  }
                  formCompletionStatus={formCompletionStatus[fieldsetIndex]}
                  updateFormCompletionStatus={(
                    formGroupIndex,
                    formIndex,
                    isCompleted
                  ) =>
                    updateFormCompletionStatus(
                      fieldsetIndex,
                      formGroupIndex,
                      formIndex,
                      isCompleted
                    )
                  }
                />
                <br />
              </React.Fragment>
            ))}
          </Suspense>
        </div>
      ))}
    </div>
  );
}
