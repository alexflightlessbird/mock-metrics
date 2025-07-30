import { Container, Text, Flex, Card } from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useSchoolTournaments } from "../common/hooks/useSchoolDetails";
import { useLocalStorage } from "@mantine/hooks";
import Loader from "../common/components/loader/GavelLoader";

export default function TournamentDashboard() {
        const [selectedSchoolId] = useLocalStorage({
        key: "school",
        defaultValue: null
    });
    
    const { data: allTournaments, isLoading: tournamentsLoading = true} = useSchoolTournaments(selectedSchoolId);
    
    if (tournamentsLoading) return (
        <Container>
            <Flex justify="center" mt="xs" align="center">
                <Loader scale={1.5} />
            </Flex>
        </Container>
    )

    console.log(allTournaments);

    return (
        <BasePage titleText="Tournament Dashboard">
            <Text>{selectedSchoolId}</Text>
        </BasePage>
    )
}