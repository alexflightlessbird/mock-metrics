import SearchBar from "../../../../common/components/SearchBar";

export default function SearchControls({
  value,
  onChange,
  placeholder,
  columns,
  selectedColumn,
  onColumnChange,
  onReset,
}) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      columns={columns}
      selectedColumn={selectedColumn}
      onColumnChange={onColumnChange}
      onReset={onReset}
      addEnabled={false}
    />
  );
}
