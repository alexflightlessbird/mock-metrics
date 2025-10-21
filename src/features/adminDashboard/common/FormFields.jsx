import {
  TextInput,
  Select,
  NumberInput,
  Checkbox,
  Space,
  Input,
} from "@mantine/core";

export const NameField = ({
  value,
  onChange,
  label = "Name",
  required = true,
  space = true,
  autofocus = false,
}) => {
  return (
    <>
      <TextInput
        value={value}
        onChange={onChange}
        label={label}
        required={required}
        data-autofocus={autofocus}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const YearField = ({
  value,
  onChange,
  label = "Year",
  required = true,
  space = true,
}) => {
  return (
    <>
      <NumberInput
        value={value}
        onChange={onChange}
        label={label}
        required={required}
        min={1980}
        max={new Date().getFullYear() + 1}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const CaseTypeField = ({
  value,
  onChange,
  label = "Type",
  allowDeselect = false,
  required = true,
  space = true,
}) => {
  return (
    <>
      <Select
        data={[
          { value: "civil", label: "Civil" },
          { value: "criminal", label: "Criminal" },
        ]}
        value={value}
        onChange={onChange}
        label={label}
        required={required}
        allowDeselect={allowDeselect}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const CaseAreaField = ({
  value,
  onChange,
  label = "Area",
  allowDeselect = false,
  required = true,
  space = true,
}) => {
  return (
    <>
      <Select
        data={[
          { value: "", label: "None" },
          {
            value: "invitationals/regionals/orcs",
            label: "Invitationals/Regionals/ORCS",
          },
          { value: "nationals", label: "Nationals" },
          { value: "rookie rumble", label: "Rookie Rumble" },
          { value: "olt", label: "OLT" },
          { value: "other", label: "Other" },
        ]}
        value={value}
        onChange={onChange}
        allowDeselect={allowDeselect}
        label={label}
        required={required}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const WitnessSideField = ({
  value,
  onChange,
  pSide,
  label = "Side",
  allowDeselect = false,
  required = true,
  space = false,
}) => {
  return (
    <>
      <Select
        data={[
          {
            value: "p",
            label:
              pSide === "prosecution"
                ? "Prosecution"
                : pSide === "plaintiff"
                ? "Plaintiff"
                : "Plaintiff/Prosecution",
          },
          { value: "d", label: "Defense" },
          { value: "s", label: "Swing" },
        ]}
        value={value}
        onChange={onChange}
        allowDeselect={allowDeselect}
        label={label}
        required={required}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const WitnessTypeField = ({
  value,
  onChange,
  label = "Type",
  allowDeselect = false,
  required = true,
  space = false,
}) => {
  return (
    <>
      <Select
        data={[
          { value: "character", label: "Character" },
          { value: "expert", label: "Expert" },
          { value: "party rep", label: "Party Rep" },
          { value: "police/investigator", label: "Police/Investigator" },
          { value: "other", label: "Other" },
        ]}
        value={value}
        onChange={onChange}
        allowDeselect={allowDeselect}
        label={label}
        required={required}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const RoleField = ({
  value,
  onChange,
  label = "Role",
  allowDeselect = false,
  required = true,
  space = false,
}) => {
  return (
    <>
      <Select
        data={[
          { value: "primary", label: "Primary Admin" },
          { value: "admin", label: "Admin" },
          { value: "viewer", label: "Viewer" },
        ]}
        value={value}
        onChange={onChange}
        allowDeselect={allowDeselect}
        label={label}
        required={required}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const SearchSelectField = ({
  type,
  data,
  value,
  onChange,
  searchable = true,
  required = true,
  space = false,
}) => {
  return (
    <>
      <Select
        label={`Select ${type} to assign`}
        placeholder={`Search ${type}s...`}
        data={data}
        value={value}
        onChange={onChange}
        searchable={searchable}
        required={required}
        nothingFoundMessage={`No ${type}s found`}
      />
      {space && <Space h="xs" />}
    </>
  );
};

export const StatusField = ({
  value,
  onChange,
  questionLabel = "Active Status",
  space = true,
  labels = ["Active", "Inactive"],
  required = true,
}) => {
  return (
    <>
      <Input.Wrapper label={questionLabel} required={required} />
      <Checkbox
        checked={value}
        onChange={onChange}
        label={`${value ? labels[0] : labels[1]}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      />
      {space && <Space h="xs" />}
    </>
  );
};
