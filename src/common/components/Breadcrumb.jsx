import { Breadcrumbs, Divider, Flex, Space } from "@mantine/core";

export default function Breadcrumb({ children }) {
  return (
    <Flex direction="column">
      <Breadcrumbs styles={{ root: { rowGap: "7px" }}}>{children}</Breadcrumbs>
      <Space h="sm" />
      <Divider />
    </Flex>
  );
}