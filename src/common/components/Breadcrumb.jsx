import { Breadcrumbs, Divider, Flex, Space } from "@mantine/core";

export default function Breadcrumb({ children }) {
  return (
    <Flex direction="column">
      <Breadcrumbs>{children}</Breadcrumbs>
      <Space h="sm" />
      <Divider />
    </Flex>
  );
}
