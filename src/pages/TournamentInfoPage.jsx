import { Grid, Text, Space, Anchor, Button, Group, Flex } from "@mantine/core";
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
import DeleteConfirmationModal from "../common/components/modals/DeleteConfirmationModal";
import { useState } from "react";

export default function TournamentDashboard() {
	const [selectedSchoolId] = useLocalStorage({
		key: "school",
		defaultValue: null,
	});
	const [deleteTournamentModalOpened, setDeleteTournamentModalOpened] = useState(false);
	const { id: tournamentId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const { role, isLoading: roleLoading } = useGetRole(
		user.id,
		selectedSchoolId
	);

	const { data: selectedTournament, isLoading: tournamentLoading = true, deleteTournament } =
		useTournamentDetails(tournamentId, selectedSchoolId);
	const { data: teams, isLoading: teamsLoading = true } =
		useTournamentTeams(tournamentId);

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

	return (
		<BasePage titleText={selectedTournament.name}>
			<Button
				mb="lg"
				leftSection={<LuArrowLeft />}
				onClick={() => navigate("/tournaments")}
			>
				All Tournaments
			</Button>

			{role === "primary" && (
				<>
					<PageSection title="danger zone">
						<Flex gap="xl" align="center">
							<Text flex={1} c="red" fw={700} size="sm" >THIS ACTION CANNOT BE REVERSED. PLEASE PROCEED WITH CAUTION.</Text>
							<Button 
								w="fit-content"
								leftSection={<LuTrash />}
								color="red"
								onClick={() => setDeleteTournamentModalOpened(true)}
								variant="outline"
							>
								Delete Tournament
							</Button>
						</Flex>
					</PageSection>
					<Space h="md" />
					<DeleteConfirmationModal
						opened={deleteTournamentModalOpened}
						onClose={() => setDeleteTournamentModalOpened(false)}
						entityName="tournament"
						entity={{
							name: selectedTournament.name
						}}
						onSubmit={() => {
							deleteTournament();
							navigate("/tournaments");
						}}
					/>
				</>
			)}

			<PageSection title="information">
				<Text>Year: {selectedTournament.year}</Text>
				<Text>
					Type:{" "}
					{selectedTournament.type === "pre-stack"
						? "Pre-Stack"
						: selectedTournament.type === "post-stack"
						? "Post-Stack"
						: ""}
				</Text>
				<Text>Area: {capitalize(selectedTournament.area)}</Text>
				<Text>
					Associated Case:{" "}
					<Anchor
						href={`/cases/${selectedTournament.case_id}`}
						onClick={(e) => {
							e.preventDefault();
							navigate(`/cases/${selectedTournament.case_id}`);
						}}
					>
						{selectedTournament.cases.name}
					</Anchor>
				</Text>
			</PageSection>

			<Space h="md" />

			<PageSection title="teams">
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
								/>
							</Grid.Col>
						))}
					</Grid>
				)}
			</PageSection>
		</BasePage>
	);
}
