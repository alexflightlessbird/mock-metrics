import { Flex, Select, TextInput, ActionIcon, Button, Space } from "@mantine/core";
import { AiOutlineSearch, AiOutlineReload, AiOutlinePlus } from "react-icons/ai";
import { useViewportSize } from "@mantine/hooks";

export default function SearchBar({ value, onChange, placeholder = "Search...", columns = [], selectedColumn, onColumnChange, resetEnabled = true, onReset, addEnabled = false, onAdd }) {
    const { width } = useViewportSize();

    return (
        <>
            <Flex gap="xs" mt="md" align="center">
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    leftSection={<AiOutlineSearch />}
                    flex={1}
                    />
                {columns.length > 0 && (
                    <Select
                    placeholder="All"
                    data={[{ value: "all", label: "All" }, ...columns]}
                    value={selectedColumn}
                    onChange={onColumnChange}
                    allowDeselect={false}
                    w="20%"
                    />
                )}
                {resetEnabled && (
                    <ActionIcon onClick={onReset} size="lg">
                        <AiOutlineReload />
                    </ActionIcon>
                )}
                {(addEnabled) && ((width > 450) || (width <= 450 && !resetEnabled)) && (
                    <ActionIcon onClick={onAdd} size="lg">
                        <AiOutlinePlus />
                    </ActionIcon>
                )}
            </Flex>
            {addEnabled && width <= 450 && resetEnabled && (
                <Button onClick={onAdd} fullWidth mt="xs" >Add School</Button>
            )}
            <Space h="md" />
        </>
    )
}