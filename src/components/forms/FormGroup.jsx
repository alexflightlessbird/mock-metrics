import React, { lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
const Form = lazy(() => import("./Form"));

export default function FormGroup({
  className,
  formGroup = [],
  formValues,
  onFormValueChange,
  formPages,
  onFormPageChange,
  formCompletionStatus,
  updateFormCompletionStatus,
}) {
  return (
    <div className={`${className} form-group`}>
      <Suspense fallback={<Skeleton active />}>
        {formGroup.map((form, formIndex) => (
          <React.Fragment key={formIndex}>
            <Form
              {...form}
              formValues={formValues}
              onFormValueChange={onFormValueChange}
              formPage={formPages[formIndex]} // Pass the correct form page index
              onFormPageChange={(newPage) =>
                onFormPageChange(formIndex, newPage)
              }
              formCompletionStatus={formCompletionStatus[formIndex]} // Pass the correct completion status
              updateFormCompletionStatus={(isCompleted) =>
                updateFormCompletionStatus(formIndex, isCompleted)
              }
            />
            {formIndex < formGroup.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </Suspense>
      <hr className="divider divider-transparent divider-stopper" />
    </div>
  );
}
