import { useMemo } from "react";

export function useSelectedItem({ items, itemIdName = "id", id = null }) {
  return useMemo(() => {
    if (!id) return null;
    return items.find((item) => item[itemIdName] === parseInt(id)) || null;
  }, [id, itemIdName, items]);
}
