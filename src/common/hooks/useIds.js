import { useId } from "react";

export function useIds(count) {
  const id = useId();
  return Array.from({ length: count }, (_, i) => `${id}-${i}`);
}
