import { Container, Title, Text, Space, Select, Skeleton, Stack, Group, ActionIcon } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../features/dashboard/hooks/useUserAssignments";
import { useSchoolDetails } from "../features/dashboard/hooks/useSchoolDetails";
import Loader from "../common/components/loader/GavelLoader";
import { useLocalStorage, useClipboard } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { capitalize } from "../common/utils/helpers";
import { LuCopy as CopyIcon, LuCopyCheck as CopiedIcon } from "react-icons/lu";

export default function SchoolInfoPage() {
    const { user } = useAuth();
    const [showSchoolId, setShowSchoolId] = useState(false);
    const { assignments, isLoading } = useUserAssignments(user.id);
    const clipboard = useClipboard({ timeout: 1000 });
    
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
        <Container fluid>
            <Text>We're not sure how you got to this page, but you haven't selected a school yet.</Text>
            <Text>Select a school to continue.</Text>
            <Space h="md" />
            <Select
                data={schoolOptions}
                value={selectedSchoolId}
                onChange={setSelectedSchoolId}
                allowDeselect={false}
            />
        </Container>
    )

    return (
        <Container fluid>
            <Title order={1}>School Information</Title>
            <Space h="md" />

            {schoolLoading && (
                <Stack>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={20} width={200} />
                    <Skeleton height={20} width={200} />
                    <Skeleton height={20} width={200} />
                </Stack>
            )}

            {!schoolLoading && (
                <Stack>
                    <Text>Name: {schoolInformation.name}</Text>
                    <Text>Short Name: {schoolInformation.short_name}</Text>
                    <Text>Premium Status: {schoolInformation.is_premium ? "Active" : "Inactive"}</Text>
                    <Text>Your Role: {role === "primary" ? "Primary Admin" : capitalize(role)}</Text>
                    <Stack gap="0">
                        <Text span style={{ cursor: "pointer", userSelect: "none", WebkitUserSelect: "none" }} c="blue" onClick={() => setShowSchoolId(!showSchoolId)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setShowSchoolId(!showSchoolId); }}>
                            {showSchoolId ? "Hide School ID" : "Show School ID (Support Purposes)"}
                        </Text>
                        {showSchoolId && (
                            <Group gap="xs">
                                <Text fz="xs">{selectedSchoolId}</Text>
                                <ActionIcon
                                    size="md"
                                    fz="lg"
                                    variant="subtle"
                                    color={clipboard.copied ? "cyan" : "blue"}
                                    onClick={() => clipboard.copy(selectedSchoolId)}
                                >
                                    {clipboard.copied ? <CopiedIcon /> : <CopyIcon />}
                                </ActionIcon>
                            </Group>
                        )}
                    </Stack>
                </Stack>
            )}
        </Container>
    )
}