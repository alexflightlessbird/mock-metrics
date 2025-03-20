import React, { lazy, Suspense } from "react";
import Skeleton from "antd/es/skeleton";
const Input = lazy(() => import("./Input"));

export default function InputGroup({ className, inputGroup }) {
  return (
    <div className={`${className} input-group`}>
      {inputGroup.map((input, inputIndex) => (
        <Suspense key={inputIndex} fallback={<Skeleton active />}>
          <Input key={inputIndex} className={className} {...input} />
        </Suspense>
      ))}
    </div>
  );
}
