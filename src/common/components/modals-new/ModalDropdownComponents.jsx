import { Select } from "@mantine/core";

export function ModalSelect({ ...props }) {
  return (
    <Select {...props} comboboxProps={{ withinPortal: false, zIndex: 1 }} />
  );
}
