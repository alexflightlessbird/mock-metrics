import React, { lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
const Form = lazy(() => import("./Form"));

export default function FormGroup({
  className,
  formGroup,
  formCompletionStatus,
  updateFormCompletionStatus,
}) {
  return (
    <div className={`${className} form-group`}>
      {formGroup.map((form, formIndex) => (
        <Suspense key={form.title || formIndex} fallback={<Skeleton active />}>
          <Form
            key={form.title || formIndex}
            className={className}
            formCompletionStatus={formCompletionStatus[formIndex]}
            updateFormCompletionStatus={(isCompleted) =>
              updateFormCompletionStatus(formIndex, isCompleted)
            }
            {...form}
          />
          <br />
        </Suspense>
      ))}
    </div>
  );
}
