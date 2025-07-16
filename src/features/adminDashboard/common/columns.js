export const SEARCH_CASE_COLUMNS = [
  { value: "name", label: "Name" },
  { value: "year", label: "Year" },
  { value: "type", label: "Type" },
  { value: "area", label: "Area" },
];

export const SEARCH_SCHOOL_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "short_name", label: "Short Name" },
];

export const SEARCH_USER_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
];

export const CASE_COLUMNS = [
  ...SEARCH_CASE_COLUMNS,
  { value: "is_active", label: "Active" },
  { value: "actions", label: "Actions", type: "actions-md" },
];

export const SCHOOL_COLUMNS = [
  ...SEARCH_SCHOOL_COLUMNS,
  { value: "is_premium", label: "Premium" },
  { value: "actions", label: "Actions", type: "actions-md" },
];

export const USER_COLUMNS = [
  ...SEARCH_USER_COLUMNS,
  { value: "actions", label: "Actions", type: "actions-md" },
];

export const ASSIGNMENT_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "role", label: "Role" },
  { value: "actions", label: "Actions", type: "actions-lg" },
];

export const WITNESS_COLUMNS = [
  { value: "name", label: "Name" },
  { value: "side", label: "Side" },
  { value: "type", label: "Type" },
  { value: "actions", label: "Actions", type: "actions-lg" },
];
