import { Radio, Card, Flex } from "@mantine/core";

export default function RadioCardGroup({
  name,
  label,
  value,
  options,
  disabledOptions = [],
  onChange,
  required = false,
  radioSize = "sm",
}) {
  return (
    <Radio.Group value={value} name={name} label={label} required={required}>
      <Flex gap="xs" direction="row" w="100%" wrap="wrap">
        {options.map((option, index) => {
          const isDisabled = disabledOptions.includes(option);
          const isSelected = value === (option.value || option.toString());

          return (
            <Card
              key={index}
              withBorder
              p="sm"
              radius="md"
              onClick={
                !isDisabled
                  ? () => onChange(name, option.value || option.toString())
                  : null
              }
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
                borderColor: isSelected
                  ? "var(--mantine-color-blue-5)"
                  : undefined,
              }}
            >
              <Radio
                value={option.value || option.toString()}
                disabled={isDisabled}
                label={option.label || option.toString()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!isDisabled) {
                      onChange(name, option.value || option.toString());
                    }
                  }
                }}
                size={radioSize}
              />
            </Card>
          );
        })}
      </Flex>
    </Radio.Group>
  );
}
