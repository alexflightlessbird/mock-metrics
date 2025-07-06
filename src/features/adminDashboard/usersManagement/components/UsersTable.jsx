import { Flex, ActionIcon, Table } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import DataTable from "../../../../common/components/DataTable";
import { useAuth } from "../../../../context/AuthContext";

const splitEmail = (email) => {
  if (!email) return "-";
  const [localPart, domain] = email.split("@");

  return (
    <span>
      {localPart}
      <wbr />@{domain}
    </span>
  );
};

const columns = [
  { key: "id", label: "ID" },
  { key: "email", label: "Email" },
  { key: "name", label: "Name" },
  { key: "actions", label: "Actions" },
];

export default function UsersTable({ data, onSelect }) {
  const { isDbManager } = useAuth();

  const renderRow = (user) => (
    <Table.Tr key={user.id}>
      <Table.Td style={{ wordBreak: "break-all" }}>{user.id}</Table.Td>
      <Table.Td>{splitEmail(user.email)}</Table.Td>
      <Table.Td>{user.name || "-"}</Table.Td>
      <Table.Td>
        <Flex wrap="wrap" rowGap="xs" columnGap="xs">
          <ActionIcon size="md" onClick={() => onSelect(user, "edit")}>
            <AiOutlineEdit />
          </ActionIcon>
          {isDbManager && (
            <ActionIcon size="md" onClick={() => onSelect(user, "delete")}>
              <AiOutlineDelete />
            </ActionIcon>
          )}
        </Flex>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No users available"
      renderRow={renderRow}
    />
  );
}
