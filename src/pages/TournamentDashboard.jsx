import {
	Grid,
	Container,
	Text,
	Flex,
	SegmentedControl,
	Box,
	Tooltip,
	ActionIcon,
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
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
import {
	useArchiveTournament,
	useUnarchiveTournament,
} from "../features/tournamentDashboard/hooks/useArchiveTournament";

export default function TournamentDashboard() {
	const [addTournamentModalOpened, setAddTournamentModalOpened] =
		useState(false);
	const [selectedSchoolId] = useLocalStorage({
		key: "school",
		defaultValue: null,
	});
	const { user } = useAuth();

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
				return allTournaments?.filter((t) => t.is_active);
			case "inactive":
				return allTournaments?.filter((t) => !t.is_active);
			default:
				return allTournaments;
		}
	}, [allTournaments, filter]);

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
			<Box mb="md">
				<SegmentedControl
					fullWidth
					value={filter}
					onChange={setFilter}
					data={[
						{ label: "All", value: "all" },
						{ label: "Current", value: "active" },
						{ label: "Archive", value: "inactive" },
					]}
				/>
			</Box>
			{(role === "admin" || role === "primary") && (
				<AddButton mb="md" onClick={() => setAddTournamentModalOpened(true)}>
					Add Tournament
				</AddButton>
			)}
			{filteredTournaments.length === 0 ? (
				<Text ta="center" c="dimmed" mt="md">
					No {filter === "inactive" ? "archived" : "current"} tournaments found.
				</Text>
			) : (
				<Grid>
					{filteredTournaments.map((t) => (
						<Grid.Col key={t.id} span={{ base: 12, md: 6, xl: 4 }}>
							<Card href={`/tournaments/${t.id}`}>
								<Flex justify="space-between" align="center">
									<Text>{t.name}</Text>
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
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}

			<AddTournamentModal
				opened={addTournamentModalOpened}
				onClose={() => setAddTournamentModalOpened(false)}
				schoolId={selectedSchoolId}
			/>
		</BasePage>
	);
}
