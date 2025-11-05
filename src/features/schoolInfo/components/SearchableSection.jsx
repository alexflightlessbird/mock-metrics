import { useMemo, useState } from "react";
import PageSection from "../../../common/components/PageSection";
import { ActionIcon, Flex, Grid, SegmentedControl, Text, TextInput, Title } from "@mantine/core";
import { LuSearch, LuX } from "react-icons/lu";
import Card from "../../../common/components/card/Card";
import ArchiveAction from "../../../common/components/ArchiveAction";

export default function SearchableSection({ 
    items, 
    onArchive, 
    onUnarchive, 
    isMobile, 
    navigateLink, 
    sectionName, 
    addModal, 
    role, 
    navigate 
}) {
    const [searchValue, setSearchValue] = useState("");
    const [filter, setFilter] = useState("active");

    const filtered = useMemo(() => {
        const filteredActive = items?.filter(i => i.is_active);
        const filteredInactive = items?.filter(i => !i.is_active);

        const filterBySearch = (items) => {
            let result = items;
            if (searchValue) {
                result = result?.filter(i => 
                    i.name.toLowerCase().includes(searchValue.toLowerCase())
                );
            }
            if (sectionName.toLowerCase() === "students") {
                return result?.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sectionName.toLowerCase() === "teams") {
                return result?.sort(
                    (a, b) => b.year - a.year || a.name.localeCompare(b.name)
                );
            }
        };

        switch (filter) {
            case "active":
                return filterBySearch(filteredActive);
            case "inactive":
                return filterBySearch(filteredInactive);
            default:
                return filterBySearch(items);
        }
    }, [items, filter, searchValue, sectionName]);

    return (
        <PageSection title={sectionName} collapsible defaultOpen>
            <SegmentedControl
                fullWidth
                value={filter}
                onChange={setFilter}
                data={[
                    { label: "All", value: "all" },
                    { label: "Current", value: "active" },
                    { label: "Archived", value: "inactive" }
                ]}
                mb="md"
            />
            <Flex
                direction={isMobile ? "column" : "row"}
                gap="sm"
                mb="md"
                align="center"
            >
                <Flex
                    direction="row"
                    flex={1}
                    gap="xs"
                    w={isMobile ? "100%" : undefined}
                >
                    <TextInput
                        id={`search-${sectionName}`}
                        w={isMobile ? "100%" : undefined}
                        flex={1}
                        leftSection={<LuSearch />}
                        rightSection={
                            searchValue && (
                                <ActionIcon
                                    variant="transparent"
                                    onClick={() => {
                                        setSearchValue("");
                                        document.getElementById(`search-${sectionName}`).focus();
                                    }}
                                >
                                    <LuX />
                                </ActionIcon>                                
                            )
                        }
                        placeholder={`Search ${sectionName}...`}
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                </Flex>
                {(role === "admin" || role === "primary") && addModal }
            </Flex>
            {!filtered || filtered.length === 0 ? (
                <Text ta="center" c="dimmed" mt="md">
                    No{filter === "inactive" ? " archived " : filter === "active" ? " current " : " " }{sectionName} found.
                </Text>
            ) : (
                <Grid>
                    {filtered.map(i => (
                        <Grid.Col key={i.id} span={{ base: 12, md: 6, xl: 4 }}>
                            <Card onClick={() => navigate(navigateLink + i.id)}>
                                <Flex justify="space-between" align="center">
                                    <Title order={5}>{i.name}</Title>
                                    {(role === "admin" || role === "primary") && (
                                        <ArchiveAction
                                            isActive={i.is_active}
                                            onArchive={() => onArchive(i.id)}
                                            onUnarchive={() => onUnarchive(i.id)}
                                        />
                                    )}
                                </Flex>
                                {sectionName === "teams" && (
                                    <>
                                        <Text>{i.year}</Text>
                                        <Text tt="capitalize" c="dimmed">{i.type}</Text>
                                    </>
                                )}
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </PageSection>
    )
}