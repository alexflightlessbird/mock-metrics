import { Button } from "@mantine/core";
import { LuPlus } from "react-icons/lu";

export default function AddButton({ onClick, children, ...props }) {
  return (
    <Button leftSection={<LuPlus />} onClick={onClick} fullWidth {...props}>
      {children}
    </Button>
  );
}
