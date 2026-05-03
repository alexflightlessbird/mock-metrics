import { MultiSelect, Select } from "@mantine/core";
import { DateInput, DatePickerInput } from "@mantine/dates";

export function ModalSelect({ clearable = true, ...props }) {
  return (
    <Select
      {...props}
      comboboxProps={{ withinPortal: false, zIndex: 1 }}
      styles={{
        dropdown: { position: "fixed", zIndex: 100, overflow: "auto" },
      }}
      clearable={clearable}
    />
  );
}

export function ModalMultiSelect({ ...props }) {
  return (
    <MultiSelect
      {...props}
      comboboxProps={{
        withinPortal: false,
        zIndex: 1,
      }}
      styles={{
        dropdown: {
          position: "fixed",
          zIndex: 100,
          overflow: "auto",
        },
      }}
    />
  );
}

export function ModalDateInput({ ...props }) {
  return (
    <DatePickerInput
      {...props}
      popoverProps={{
        withinPortal: false,
        position: "fixed",
        zIndex: 100,
        overflow: "auto",
      }}
      clearable
      fullwidth
    />
  );
}
