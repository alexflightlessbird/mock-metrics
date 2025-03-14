import React, { useState, useRef, useEffect } from "react";
import InputField from "./InputField";

export default function Dialog({
  className,
  legendText,
  handleSubmit,
  questions,
}) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);

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
    e.preventDefault();

    const isValid = questions.every((q) => {
      if (q.type === "searchable-dropdown") {
        return q.options.some((option) => option.value === values[q.id]);
      }
      return true;
    });

    if (!isValid) {
      alert("Please select a valid option from the list.");
      return;
    }

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

  useEffect(() => {
    const form = formRef.current;

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleFormSubmit(e);
      }
    };

    if (form) form.addEventListener("keydown", handleKeyDown);

    return () => {
      if (form) form.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFormSubmit]);

  return (
    <dialog
      className={className}
      ref={dialogRef}
      style={{ overflow: "visible" }}
    >
      <fieldset>
        <legend>{legendText}</legend>
        <form onSubmit={handleFormSubmit} ref={formRef}>
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
