import React, { useState, useRef } from "react";
import InputField from "./InputField";

export default function Dialog({
  className,
  legendText,
  handleSubmit,
  questions,
}) {
  const dialogRef = useRef(null);

  const initialValues = questions.reduce((acc, q) => {
    acc[q.id || `question-${questions.indexOf(q)}`] = q.value || "";
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);

  const handleInputChange = (id, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    handleSubmit(values);
    dialogRef.current.close();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dialogRef.current.close();
  };

  const handleReset = (e) => {
    e.preventDefault();
    setValues(initialValues);
  };

  return (
    <dialog className={className} ref={dialogRef}>
      <fieldset>
        <legend>{legendText}</legend>
        <form onSubmit={handleFormSubmit}>
          {questions.map((q, i) => (
            <InputField
              key={i}
              {...q}
              id={q.id || `question-${i}`}
              value={values[q.id || `question-${i}`]}
              onChange={handleInputChange}
            />
          ))}
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleReset}>Reset</button>
          <button type="submit">Submit</button>
        </form>
      </fieldset>
    </dialog>
  );
}
