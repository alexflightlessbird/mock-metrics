import {
  Grid,
  Text,
  Space,
  Button,
  Flex,
  Divider,
  Group,
  Stack,
  NumberInput,
  Select,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useLocalStorage } from "@mantine/hooks";
import Loader from "../common/components/loader/GavelLoader";
import { useNavigate, useParams } from "react-router-dom";
import {
  useTournamentDetails,
  useTournamentTeams,
} from "../common/hooks/useTournamentDetails";
import PageSection from "../common/components/PageSection";
import { capitalize } from "../common/utils/helpers";
import TeamCard from "../features/tournamentInfo/components/TeamCard";
import { LuArrowLeft, LuTrash } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useGetRole } from "../common/hooks/useGetRole";
import DeleteConfirmationModal from "../common/components/modals-new/DeleteConfirmationModal";
import AddButton from "../common/components/AddButton";
import AddTeamModal from "../features/tournamentInfo/components/AddTeamModal";
import ShowIdText from "../common/components/ShowIdText";
import { useEffect, useState } from "react";
import PageDetailSection from "../common/components/PageDetailSection";

export default function TournamentInfoPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });
  const [editMode, setEditMode] = useState(false);
  const { id: tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournamentYear, setTournamentYear] = useState(null);
  const [tournamentType, setTournamentType] = useState(null);
  const [tournamentArea, setTournamentArea] = useState(null);

  const { role, isLoading: roleLoading } = useGetRole(
    user.id,
    selectedSchoolId
  );

  const {
    data: selectedTournament,
    isLoading: tournamentLoading = true,
    deleteTournament,
    updateTournament,
  } = useTournamentDetails(tournamentId, selectedSchoolId);
  const { data: teams, isLoading: teamsLoading = true } =
    useTournamentTeams(tournamentId);

  useEffect(() => {
    setTournamentYear(selectedTournament?.year);
    setTournamentType(selectedTournament?.type);
    setTournamentArea(selectedTournament?.area);
  }, [selectedTournament]);

  if (tournamentLoading || teamsLoading || roleLoading)
    return (
      <BasePage titleText="Loading...">
        <Loader scale={1.5} />
      </BasePage>
    );

  if (!selectedTournament || Object.keys(selectedTournament).length === 0)
    return (
      <BasePage titleText="Invalid Tournament">
        <Text>Please check the tournament ID and try again.</Text>
      </BasePage>
    );

  const handleSave = async ({ title }) => {
    const updates = {};

    if (title !== selectedTournament.name) {
      updates.name = title;
    }
    if (tournamentYear !== selectedTournament.year) {
      updates.year = tournamentYear;
    }
    if (tournamentType !== selectedTournament.type) {
      updates.type = tournamentType;
    }
    if (tournamentArea !== selectedTournament.area) {
      updates.area = tournamentArea;
    }
    await updateTournament(updates);
    setEditMode(false);
  };

  const styleProps = {
    fontSize: "1.875rem",
    fontWeight: 700,
    lineHeight: 1.2,
    border: "none",
    borderBottom: "2px solid #000",
    outline: "none",
    marginRight: "10px",
  };

  return (
    <BasePage
      titleText={selectedTournament.name}
      editEnabled={role === "admin" || role === "primary"}
      editMode={editMode}
      setEditMode={setEditMode}
      editableTitle={true}
      onSave={handleSave}
    >
      <Button
        mb="sm"
        leftSection={<LuArrowLeft />}
        onClick={() => navigate("/tournaments")}
      >
        All Tournaments
      </Button>

      <Text c="dimmed" fz="sm" mb="sm">
        Last Updated:{" "}
        {new Date(selectedTournament?.updated_at + "Z").toLocaleString()}
      </Text>

      <Divider mb="md" />

      <PageDetailSection
        editable={editMode}
        details={[
          { name: "Year", value: editMode ? (
            <NumberInput
              value={tournamentYear}
              onChange={setTournamentYear}
              min={1980}
              max={new Date().getFullYear() + 1}
              style={styleProps}
            />
          ) : selectedTournament.year },
          { name: "Type", value: editMode ? (
            <Select
              value={tournamentType}
              onChange={setTournamentType}
              data={[
                { value: "pre-stack", label: "Pre-Stack" },
                { value: "post-stack", label: "Post-Stack" }
              ]}
              style={styleProps}
            />
          ) : selectedTournament.type === "pre-stack" ? "Pre-Stack" : selectedTournament.type === "post-stack" ? "Post-Stack" : "" },
          { name: "Area", value: editMode ? (
            <Select
              value={tournamentArea}
              onChange={setTournamentArea}
              data={[
                { value: "invitational", label: "Invitational" },
                { value: "regionals", label: "Regionals" },
                { value: "orcs", label: "ORCS" },
                { value: "nationals", label: "Nationals" },
                { value: "rookie rumble", label: "Rookie Rumble" },
                { value: "olt", label: "OLT" },
                { label: "Other", value: "other" },
              ]}
              style={styleProps}  
            />
          ) : capitalize(selectedTournament.area) },
          { name: "Associated Case", value: `${selectedTournament.cases.name} (${selectedTournament.cases.year})` },
          { type: "id", name: "Tournament", value: selectedTournament.id }
        ]}
      />

      <Space h="md" />

      {role === "primary" && (
        <>
          <PageSection title="danger zone">
            <Flex gap="xl" align="center">
              <Text flex={1} c="red" fw={700} size="sm">
                THIS ACTION CANNOT BE REVERSED. PLEASE PROCEED WITH CAUTION.
              </Text>
              <DeleteConfirmationModal
                trigger={
                  <Button
                    w="fit-content"
                    leftSection={<LuTrash />}
                    color="red"
                    variant="outline"
                  >
                    Delete Tournament
                  </Button>
                }
                includeBallots={true}
                onSubmit={() => {
                  deleteTournament();
                  navigate("/tournaments");
                }}
                entity={{
                  name: selectedTournament.name,
                }}
                entityName="tournament"
              />
            </Flex>
          </PageSection>
          <Space h="md" />
        </>
      )}

      <PageSection title="teams">
        {selectedTournament.is_active &&
          (role === "admin" || role === "primary") && (
            <AddTeamModal
              trigger={<AddButton>Add Team to Tournament</AddButton>}
              tournamentId={tournamentId}
              tournamentName={selectedTournament.name}
            />
          )}
        {teams.length === 0 ? (
          <Text ta="center" c="dimmed" mt="md">
            No teams found for this tournament.
          </Text>
        ) : (
          <Grid>
            {teams.map((t) => (
              <Grid.Col key={t.team_id} span={{ base: 12, md: 6, xl: 4 }}>
                <TeamCard
                  team={t}
                  caseType={selectedTournament.cases.type}
                  key={t.team_id}
                  nationalsTournament={
                    selectedTournament.area.toLowerCase() === "nationals"
                  }
                  tournamentStatus={selectedTournament.is_active}
                  tournamentName={selectedTournament.name}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </PageSection>
    </BasePage>
  );
}
