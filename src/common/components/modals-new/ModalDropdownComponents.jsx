import { MultiSelect, Select } from "@mantine/core";

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
