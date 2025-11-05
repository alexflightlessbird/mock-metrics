import { useMemo, useState } from "react";
import { useSchoolTeams } from "../../../common/hooks/useSchoolDetails";
import { useArchiveTeam, useUnarchiveTeam } from "../hooks/useArchiveTeam";
import Loader from "../../../common/components/loader/GavelLoader";
import PageSection from "../../../common/components/PageSection";
import { ActionIcon, Flex, Grid, SegmentedControl, Skeleton, Stack, Text, TextInput, Title } from "@mantine/core";
import { LuSearch, LuX } from "react-icons/lu";
import AddTeamModal from "./AddTeamModal";
import AddButton from "../../../common/components/AddButton";
import Card from "../../../common/components/card/Card";
import ArchiveAction from "../../../common/components/ArchiveAction";

export default function TeamsSection({ schoolId, role, isMobile, navigate }) {
    const [teamSearchValue, setTeamSearchValue] = useState("");
    const [teamFilter, setTeamFilter] = useState("active");

    const { data: teams = [], isLoading: teamsLoading = true } = useSchoolTeams(schoolId);
    const { mutate: archiveTeam } = useArchiveTeam();
    const { mutate: unarchiveTeam } = useUnarchiveTeam();

    const filteredTeams = useMemo(() => {
        const filteredActive = teams?.filter(t => t.is_active);
        const filteredInactive = teams?.filter(t => !t.is_active);

        const filterBySearch = (teams) => {
            let result = teams;
            if (teamSearchValue) {
                result = result?.filter(t => 
                    t.name.toLowerCase().includes(teamSearchValue.toLowerCase())
                );
            }
            return result?.sort(
                (a, b) => b.year - a.year || a.name.localeCompare(b.name)
            );
        };

        switch (teamFilter) {
            case "active":
                return filterBySearch(filteredActive);
            case "inactive":
                return filterBySearch(filteredInactive);
            default:
                return filterBySearch(teams);
        }
    }, [teams, teamFilter, teamSearchValue]);

    if (teamsLoading) return (
        <Stack>
            <Skeleton height={50} width="100%" />
            <Loader scale={1.5} />
        </Stack>
    );

    return (
        <PageSection title="teams" collapsible defaultOpen>
            <SegmentedControl
                fullWidth
                value={teamFilter}
                onChange={setTeamFilter}
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
                        id="search-team"
                        w={isMobile ? "100%" : undefined}
                        flex={1}
                        leftSection={<LuSearch />}
                        rightSection={
                            teamSearchValue && (
                                <ActionIcon
                                    variant="transparent"
                                    onClick={() => {
                                        setTeamSearchValue("");
                                        document.getElementById("search-team").focus();
                                    }}
                                >
                                    <LuX />
                                </ActionIcon>
                            )
                        }
                        placeholder="Search..."
                        value={teamSearchValue}
                        onChange={e => setTeamSearchValue(e.target.value)}
                    />
                </Flex>
                {(role === "admin" || role === "primary") && (
                    <AddTeamModal
                        schoolId={schoolId}
                        trigger={<AddButton w={isMobile ? "100%" : "auto"}>Add Team</AddButton>}
                    />
                )}
            </Flex>
            {!filteredTeams || filteredTeams.length === 0 ? (
                <Text ta="center" c="dimmed" mt="md">
                    No{teamFilter === "inactive" ? " archived " : teamFilter === " active " ? " current " : " "}teams found.
                </Text>
            ) : (
                <Grid>
                    {filteredTeams.map(t => (
                        <Grid.Col key={t.id} span={{ base: 12, md: 6, xl: 4 }}>
                            <Card onClick={() => navigate("/school/t/" + t.id)}>
                                <Flex justify="space-between" align="center">
                                    <Title order={5}>{t.name}</Title>
                                    {(role === "admin" || role === "primary") && (
                                        <ArchiveAction
                                            isActive={t.is_active}
                                            onArchive={() => archiveTeam({ teamId: t.id, schoolId })}
                                            onUnarchive={() => unarchiveTeam({ teamId: t.id, schoolId })}
                                        />
                                    )}
                                </Flex>
                                <Text>{t.year}</Text>
                                <Text tt="capitalize" c="dimmed">{t.type}</Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </PageSection>
    )
}