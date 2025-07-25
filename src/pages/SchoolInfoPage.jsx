import { Text, Space, Select, Skeleton, Stack } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import { useSchoolDetails } from "../features/schoolInfo/hooks/useSchoolDetails";
import { useLocalStorage } from "@mantine/hooks";
import { capitalize } from "../common/utils/helpers";
import BasePage from "../common/components/BasePage";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";

export default function SchoolInfoPage() {
    const { user } = useAuth();
    const { assignments, isLoading } = useUserAssignments(user.id);
    
    const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
        key: "school",
        defaultValue: null,
    });

    const role = assignments.find((a) => a.school_id === selectedSchoolId)?.role;
    
    const { data: schoolInformation = {}, isLoading: schoolLoading = true } = useSchoolDetails(selectedSchoolId);

    const schoolOptions = assignments.map((a) => ({
        value: a.school_id,
        label: `${a.schools.name} (${a.schools?.short_name || ""})`
    }));

    if (!selectedSchoolId) return (
        <BasePage titleText="Well this is awkward...">
            <Text>We're not sure how you got to this page, but you haven't selected a school yet.</Text>
            <Text>Select a school to continue.</Text>
            <Space h="md" />
            <Select
                data={schoolOptions}
                value={selectedSchoolId}
                onChange={setSelectedSchoolId}
                allowDeselect={false}
            />
        </BasePage>
    )

    return (
        <BasePage titleText="School">
            {schoolLoading || isLoading && (
                <Stack>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={20} width={200} />
                    <Skeleton height={20} width={200} />
                    <Skeleton height={20} width={200} />
                </Stack>
            )}

            {!schoolLoading && !isLoading && (
                <Stack gap="lg">
                    <PageSection title="information">
                        <Text>Name: {schoolInformation.name}</Text>
                        <Text>Short Name: {schoolInformation.short_name}</Text>
                        <Text>Premium Status: {schoolInformation.is_premium ? "Active" : "Inactive"}</Text>
                        <Text>Your Role: {role === "primary" ? "Primary Admin" : capitalize(role)}</Text>
                        <ShowIdText idName="School" idValue={selectedSchoolId} />
                    </PageSection>
                </Stack>
            )}
        </BasePage>
    )
}