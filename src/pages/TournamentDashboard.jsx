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
  Checkbox,
  Menu,
  Group,
  Button,
  Divider
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useSchoolTournaments } from "../common/hooks/useSchoolDetails";
import { useLocalStorage, useListState } from "@mantine/hooks";
import Loader from "../common/components/loader/GavelLoader";
import Card from "../common/components/card/Card";
import { useState, useMemo } from "react";
import { useGetRole } from "../common/hooks/useGetRole";
import { useAuth } from "../context/AuthContext";
import AddTournamentModal from "../features/tournamentDashboard/components/AddTournamentModal";
import AddButton from "../common/components/AddButton";
import { LuArchive, LuArchiveRestore, LuFilter, LuSearch, LuX } from "react-icons/lu";
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

  const [areaFilter, areaFilterHandlers] = useListState([
    { label: "Invitational", value: "invitational", checked: true },
    { label: "Regionals", value: "regionals", checked: true },
    { label: "ORCS", value: "orcs", checked: true },
    { label: "Nationals", value: "nationals", checked: true },
    { label: "Rookie Rumble", value: "rookie rumble", checked: true },
    { label: "OLT", value: "olt", checked: true },
    { label: "Other", value: "other", checked: true }
  ]);

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
    const selectedAreas = areaFilter.filter((area) => area.checked).map((area) => area.value);

    const filteredActive = allTournaments?.filter((t) => t.is_active);
    const filteredInactive = allTournaments?.filter((t) => !t.is_active);

    const filterBySearchAndArea = (tournaments) => {
      let result = tournaments;
      if (searchValue) {
        result = result?.filter((t) => t.name.toLowerCase().includes(searchValue.toLowerCase()));
      }
      if (selectedAreas.length > 0) {
        result = result?.filter((t) => selectedAreas.includes(t.area));
      }
      return result;
    }
    
    switch (filter) {
      case "active":
        return filterBySearchAndArea(filteredActive);
      case "inactive":
        return filterBySearchAndArea(filteredInactive);
      default:
        return filterBySearchAndArea(allTournaments);
    }
  }, [allTournaments, filter, searchValue, areaFilter]);

  const allChecked = areaFilter.every((area) => area.checked);
  const indeterminate = areaFilter.some((area) => area.checked) && !allChecked;

  const areaItems = areaFilter.map((area, index) => (
    <Menu.Item key={area.value}>
      <Checkbox
        checked={area.checked}
        label={area.label}
        onChange={(e) => areaFilterHandlers.setItemProp(index, "checked", e.currentTarget.checked)}
      />
    </Menu.Item>
  ))

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
        <Flex direction="row" flex={1} gap="xs" w={isMobile ? "100%" : undefined}>
          <TextInput
            id={"search-tournament"}
            w={isMobile ? "100%" : undefined}
            flex={1}
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
          <Menu shadow="md" width="auto" closeOnItemClick={false}>
            <Menu.Target>
              <Button variant="outline" leftSection={<LuFilter />}>
                Filter
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Checkbox
                  checked={allChecked}
                  indeterminate={indeterminate}
                  label="All Areas"
                  onChange={() => areaFilterHandlers.setState(areaFilter.map((area) => ({ ...area, checked: !allChecked })))}
                />
              </Menu.Item>
              <Divider />
              {areaItems}
            </Menu.Dropdown>
          </Menu>
        </Flex>
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
