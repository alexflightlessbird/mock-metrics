import React, { lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
const Fieldset = lazy(() => import("./Fieldset"));

export default function FieldsetGroup({
  className,
  fieldsetGroup,
  formCompletionStatus,
  updateFormCompletionStatus,
}) {
  return (
    <div className={`${className} fieldset-group`}>
      {fieldsetGroup.map((fieldset, fieldsetIndex) => (
        <Suspense
          key={fieldset.title || fieldsetIndex}
          fallback={<Skeleton active />}
        >
          <Fieldset
            key={fieldset.title || fieldsetIndex}
            className={className}
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
            {...fieldset}
          />
          <br />
        </Suspense>
      ))}
    </div>
  );
}
