import {
  Grid,
  Text,
  Space,
  Button,
  Divider,
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
import { LuArrowLeft } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { useGetRole } from "../common/hooks/useGetRole";
import AddButton from "../common/components/AddButton";
import AddTeamModal from "../features/tournamentInfo/components/AddTeamModal";
import { useEffect, useState } from "react";
import PageDetailSection from "../common/components/PageDetailSection";
import DangerZoneSection from "../common/components/DangerZoneSection";
import { styleProps } from "../common/editModeStyleProps";
import { DatePickerInput } from "@mantine/dates";

export default function TournamentInfoPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });
  const [editMode, setEditMode] = useState(false);
  const { id: tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log(selectedTournament?.start_date);
  }, [editMode]);

  const [tournamentDate, setTournamentDate] = useState(null);
  const [tournamentType, setTournamentType] = useState(null);
  const [tournamentArea, setTournamentArea] = useState(null);

  const { role, isLoading: roleLoading } = useGetRole(
    user.id,
    selectedSchoolId,
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
    setTournamentDate(selectedTournament?.start_date);
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
    if (tournamentDate !== selectedTournament.start_date) {
      updates.start_date = tournamentDate;
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
          {
            name: "Date",
            value: editMode ? (
              <DatePickerInput
                value={tournamentDate}
                onChange={setTournamentDate}
                min={new Date(1980, 0, 1)}
                max={new Date().getFullYear() + 1, 11, 31}
                style={styleProps}
              />
            ) : (
              new Date(selectedTournament.start_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })
            ),
          },
          {
            name: "Type",
            value: editMode ? (
              <Select
                value={tournamentType}
                onChange={setTournamentType}
                data={[
                  { value: "pre-stack", label: "Pre-Stack" },
                  { value: "post-stack", label: "Post-Stack" },
                ]}
                style={styleProps}
              />
            ) : selectedTournament.type === "pre-stack" ? (
              "Pre-Stack"
            ) : selectedTournament.type === "post-stack" ? (
              "Post-Stack"
            ) : (
              ""
            ),
          },
          {
            name: "Area",
            value: editMode ? (
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
            ) : (
              capitalize(selectedTournament.area)
            ),
          },
          {
            name: "Associated Case",
            value: `${selectedTournament.cases.name} (${selectedTournament.cases.year})`,
          },
          { type: "id", name: "Tournament", value: selectedTournament.id },
        ]}
      />

      <Space h="md" />

      {role === "primary" && (
        <DangerZoneSection
          buttonLabel="Tournament"
          includeBallots={true}
          onSubmit={() => {
            deleteTournament();
            navigate("/tournaments");
          }}
          entity={{ name: selectedTournament.name }}
          entityName="tournament"
        />
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
