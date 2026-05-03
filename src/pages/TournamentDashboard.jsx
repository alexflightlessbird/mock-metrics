import {
  Grid,
  Container,
  Text,
  Flex,
  SegmentedControl,
  ActionIcon,
  TextInput,
  Title,
  Checkbox,
  Menu,
  Button,
  Divider,
  Center,
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
import { LuFilter, LuSearch, LuX } from "react-icons/lu";
import {
  useArchiveTournament,
  useUnarchiveTournament,
} from "../features/tournamentDashboard/hooks/useArchiveTournament";
import { useMobile } from "../context/MobileContext";
import ArchiveAction from "../common/components/ArchiveAction";

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
    { label: "Other", value: "other", checked: true },
  ]);

  const [typeFilter, typeFilterHandlers] = useListState([
    { label: "Pre-Stack", value: "pre-stack", checked: true },
    { label: "Post-Stack", value: "post-stack", checked: true },
  ]);

  const { role, isLoading: roleLoading } = useGetRole(
    user.id,
    selectedSchoolId,
  );
  const { mutate: archiveTournament } = useArchiveTournament();
  const { mutate: unarchiveTournament } = useUnarchiveTournament();

  const { data: allTournaments, isLoading: tournamentsLoading = true } =
    useSchoolTournaments(selectedSchoolId);
  const [filter, setFilter] = useState("active");

  const filteredTournaments = useMemo(() => {
    const selectedAreas = areaFilter
      .filter((area) => area.checked)
      .map((area) => area.value);

    const selectedTypes = typeFilter
      .filter((type) => type.checked)
      .map((type) => type.value);

    const filteredActive = allTournaments?.filter((t) => t.is_active);
    const filteredInactive = allTournaments?.filter((t) => !t.is_active);

    const filterBySearchAndAreaAndType = (tournaments) => {
      let result = tournaments;
      if (searchValue) {
        result = result?.filter((t) =>
          t.name.toLowerCase().includes(searchValue.toLowerCase()),
        );
      }
      if (selectedAreas.length > 0) {
        result = result?.filter((t) => selectedAreas.includes(t.area));
      }
      if (selectedTypes.length > 0) {
        result = result?.filter((t) => selectedTypes.includes(t.type));
      }
      return result?.sort(
        (a, b) => b.year - a.year || a.name.localeCompare(b.name),
      );
    };

    switch (filter) {
      case "active":
        return filterBySearchAndAreaAndType(filteredActive)
          ?.sort((a, b) => b.name.localeCompare(a.name))
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      case "inactive":
        return filterBySearchAndAreaAndType(filteredInactive)
          ?.sort((a, b) => b.name.localeCompare(a.name))
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      default:
        return filterBySearchAndAreaAndType(
          allTournaments
            ?.sort((a, b) => b.name.localeCompare(a.name))
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date)),
        );
    }
  }, [allTournaments, filter, searchValue, areaFilter, typeFilter]);

  const allAreaChecked = areaFilter.every((area) => area.checked);
  const indeterminateArea =
    areaFilter.some((area) => area.checked) && !allAreaChecked;

  const allTypeChecked = typeFilter.every((type) => type.checked);
  const indeterminateType =
    typeFilter.some((type) => type.checked) && !allTypeChecked;

  const areaItems = areaFilter.map((area, index) => (
    <Menu.Item key={area.value} pl="xl">
      <Checkbox
        checked={area.checked}
        label={area.label}
        onChange={(e) =>
          areaFilterHandlers.setItemProp(
            index,
            "checked",
            e.currentTarget.checked,
          )
        }
      />
    </Menu.Item>
  ));

  const typeItems = typeFilter.map((type, index) => (
    <Menu.Item key={type.value} pl="xl">
      <Checkbox
        checked={type.checked}
        label={type.label}
        onChange={(e) =>
          typeFilterHandlers.setItemProp(
            index,
            "checked",
            e.currentTarget.checked,
          )
        }
      />
    </Menu.Item>
  ));

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
        <Flex
          direction="row"
          flex={1}
          gap="xs"
          w={isMobile ? "100%" : undefined}
        >
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
            placeholder="Search tournaments..."
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
              {/* put button in center of dropdown */}
              <Center m="xs">
                <Button
                  variant="outline"
                  onClick={() => {
                    areaFilterHandlers.setState(
                      areaFilter.map((area) => ({ ...area, checked: true })),
                    );
                    typeFilterHandlers.setState(
                      typeFilter.map((type) => ({ ...type, checked: true })),
                    );
                  }}
                  size="xs"
                >
                  Reset Filters
                </Button>
              </Center>

              <Menu.Item>
                <Checkbox
                  checked={allAreaChecked}
                  indeterminate={indeterminateArea}
                  label="All Areas"
                  onChange={() =>
                    areaFilterHandlers.setState(
                      areaFilter.map((area) => ({
                        ...area,
                        checked: !allAreaChecked,
                      })),
                    )
                  }
                />
              </Menu.Item>
              {areaItems}
              <Divider />
              <Menu.Item>
                <Checkbox
                  checked={allTypeChecked}
                  indeterminate={indeterminateType}
                  label="All Types"
                  onChange={() =>
                    typeFilterHandlers.setState(
                      typeFilter.map((type) => ({
                        ...type,
                        checked: !allTypeChecked,
                      })),
                    )
                  }
                />
              </Menu.Item>
              {typeItems}
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
          No{" "}
          {filter === "inactive"
            ? " archived"
            : filter === "active"
              ? " current"
              : ""}{" "}
          tournaments found.
        </Text>
      ) : (
        <Grid>
          {filteredTournaments.map((t) => (
            <Grid.Col key={t.id} span={{ base: 12, md: 6, xl: 4 }}>
              <Card href={`/tournaments/${t.id}`}>
                <Flex justify="space-between" align="center">
                  <Title order={5}>{t.name}</Title>
                  {(role === "admin" || role === "primary") && (
                    <ArchiveAction
                      isActive={t.is_active}
                      onArchive={() =>
                        archiveTournament({
                          tournamentId: t.id,
                          schoolId: selectedSchoolId,
                        })
                      }
                      onUnarchive={() =>
                        unarchiveTournament({
                          tournamentId: t.id,
                          schoolId: selectedSchoolId,
                        })
                      }
                    />
                  )}
                </Flex>
                <Divider mt="xs" mb="xs" />
                <Text c="dimmed">
                  {new Date(t.start_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </Text>
                <Text tt="capitalize" c="dimmed">
                  {t.type} |{" "}
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
