import {
  Grid,
  Container,
  Text,
  Flex,
  SegmentedControl,
  Box,
  Tooltip,
  ActionIcon,
  TextInput,
  Badge,
  Stack,
  Title,
  Chip,
  MultiSelect,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useSchoolTournaments } from "../common/hooks/useSchoolDetails";
import { useLocalStorage } from "@mantine/hooks";
import Loader from "../common/components/loader/GavelLoader";
import Card from "../common/components/card/Card";
import { useState, useMemo } from "react";
import { useGetRole } from "../common/hooks/useGetRole";
import { useAuth } from "../context/AuthContext";
import AddTournamentModal from "../features/tournamentDashboard/components/AddTournamentModal";
import AddButton from "../common/components/AddButton";
import { LuArchive, LuArchiveRestore, LuSearch, LuX } from "react-icons/lu";
import {
  useArchiveTournament,
  useUnarchiveTournament,
} from "../features/tournamentDashboard/hooks/useArchiveTournament";
import { useMobile } from "../context/MobileContext";

export default function TournamentDashboard() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });
  const { user } = useAuth();
  const { isMobile } = useMobile();
  const [searchValue, setSearchValue] = useState("");

  const { role, isLoading: roleLoading } = useGetRole(
    user.id,
    selectedSchoolId
  );
  const { mutate: archiveTournament } = useArchiveTournament();
  const { mutate: unarchiveTournament } = useUnarchiveTournament();

  const { data: allTournaments, isLoading: tournamentsLoading = true } =
    useSchoolTournaments(selectedSchoolId);
  const [filter, setFilter] = useState("active");

  const filteredTournaments = useMemo(() => {
    switch (filter) {
      case "active":
        const filteredActive = allTournaments?.filter((t) => t.is_active);
        if (searchValue) {
          return filteredActive?.filter((t) =>
            t.name.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        return filteredActive;
      case "inactive":
        const filteredInactive = allTournaments?.filter((t) => !t.is_active);
        if (searchValue) {
          return filteredInactive?.filter((t) =>
            t.name.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        return filteredInactive;
      default:
        if (searchValue) {
          return allTournaments?.filter((t) =>
            t.name.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        return allTournaments;
    }
  }, [allTournaments, filter, searchValue]);

  if (tournamentsLoading || roleLoading)
    return (
      <Container>
        <Flex justify="center" mt="xs" align="center">
          <Loader scale={1.5} />
        </Flex>
      </Container>
    );

  return (
    <BasePage titleText="Tournament Dashboard">
      <SegmentedControl
        fullWidth
        value={filter}
        onChange={setFilter}
        data={[
          { label: "All", value: "all" },
          { label: "Current", value: "active" },
          { label: "Archived", value: "inactive" },
        ]}
        mb="md"
      />
      <Flex
        direction={isMobile ? "column" : "row"}
        gap="sm"
        mb="md"
        align="center"
      >
        <TextInput
          id={"search-tournament"}
          w={isMobile ? "100%" : undefined}
          flex={isMobile ? undefined : 1}
          leftSection={<LuSearch />}
          rightSection={
            searchValue && (
              <ActionIcon
                variant="transparent"
                onClick={() => {
                  setSearchValue("");
                  document.getElementById("search-tournament").focus();
                }}
              >
                <LuX />
              </ActionIcon>
            )
          }
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {(role === "admin" || role === "primary") && (
          <AddTournamentModal
            schoolId={selectedSchoolId}
            trigger={
              <AddButton w={isMobile ? "100%" : "auto"}>
                Add Tournament
              </AddButton>
            }
          />
        )}
      </Flex>
      {!filteredTournaments || filteredTournaments.length === 0 ? (
        <Text ta="center" c="dimmed" mt="md">
          No {filter === "inactive" ? "archived" : "current"} tournaments found.
        </Text>
      ) : (
        <Grid>
          {filteredTournaments.map((t) => (
            <Grid.Col key={t.id} span={{ base: 12, md: 6, xl: 4 }}>
              <Card href={`/tournaments/${t.id}`}>
                <Flex justify="space-between" align="center">
                  <Title order={5}>{t.name}</Title>
                  {(role === "admin" || role === "primary") && (
                    <Tooltip
                      label={
                        t.is_active
                          ? "Archive Tournament"
                          : "Unarchive Tournament"
                      }
                      withArrow
                    >
                      <ActionIcon
                        variant="subtle"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(t.id, selectedSchoolId);
                          if (t.is_active) {
                            archiveTournament({
                              tournamentId: t.id,
                              schoolId: selectedSchoolId,
                            });
                          } else {
                            unarchiveTournament({
                              tournamentId: t.id,
                              schoolId: selectedSchoolId,
                            });
                          }
                        }}
                      >
                        {t.is_active ? <LuArchive /> : <LuArchiveRestore />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Flex>
                <Text>{t.year}</Text>
                <Text tt="capitalize" c="dimmed">
                  {t.area === "orcs" || t.area === "olt"
                    ? t.area.toUpperCase()
                    : t.area}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </BasePage>
  );
}
