import { Table, Flex, ActionIcon, Checkbox } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export default function SchoolsTable ({ schools, onSelectSchool }) {
    return(
        <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            stickyHeader
            style={{ cursor: "default" }}
            fz="xs"
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Short Name</Table.Th>
                    <Table.Th>Premium</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {schools.map((school) => (
                    <Table.Tr key={school.id}>
                        <Table.Td style={{ wordBreak: "break-all" }}>{school.id}</Table.Td>
                        <Table.Td>{school.name || "-"}</Table.Td>
                        <Table.Td>{school.short_name || "-"}</Table.Td>
                        <Table.Td>
                            {school.is_premium 
                                ? <Checkbox checked readOnly /> 
                                : <Checkbox checked={false} readOnly />
                            }
                        </Table.Td>
                        <Table.Td>
                            <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                                <ActionIcon size="md" onClick={() => onSelectSchool(school, "edit")}>
                                    <AiOutlineEdit />
                                </ActionIcon>
                                <ActionIcon size="md" onClick={() => onSelectSchool(school, "delete")}>
                                    <AiOutlineDelete />
                                </ActionIcon>
                            </Flex>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    )
}