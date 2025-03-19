import React, { lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
const Input = lazy(() => import("./Input"));

export default function InputGroup({
  className,
  inputs = [],
  formValues,
  onFormValueChange,
}) {
  return (
    <div className={`${className} input-group`}>
      <Suspense fallback={<Skeleton active />}>
        {inputs.map((input, index) => (
          <Input
            key={index}
            {...input}
            value={
              Array.isArray(formValues[input.name])
                ? formValues[input.name] || []
                : formValues[input.name] || ""
            }
            onChange={(value) => onFormValueChange(input.name, value)}
          />
        ))}
      </Suspense>
    </div>
  );
}
