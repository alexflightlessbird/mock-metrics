export function sortData(data, sortBy, reversed) {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    // Handle nested properties
    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((current, key) => {
        return current ? current[key] : undefined;
      }, obj);
    };

    let aValue = getNestedValue(a, sortBy);
    let bValue = getNestedValue(b, sortBy);

    // Speech sorting - null values at bottom
    if (sortBy === "averageSpeech") {
      const aIsNull = aValue === null || aValue === -Infinity;
      const bIsNull = bValue === null || bValue === -Infinity;

      // If both null, they're equal
      if (aIsNull && bIsNull) return 0;
      // If only a is null, it goes after b
      if (aIsNull) return 1;
      // If only b is null, it goes after a
      if (bIsNull) return -1;

      // Both have non-null values, proceed to normal comparison
      return reversed ? aValue - bValue : bValue - aValue;
    }

    // Handle null/undefined values for other sorts
    if (aValue == null) aValue = -Infinity;
    if (bValue == null) bValue = -Infinity;

    // Numeric sorting
    if (typeof aValue === "number" && typeof bValue === "number")
      return reversed ? aValue - bValue : bValue - aValue;

    // String sorting
    if (typeof aValue === "string" && typeof bValue === "string")
      return reversed
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);

    return 0;
  });
}
