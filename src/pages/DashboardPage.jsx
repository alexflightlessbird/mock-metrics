import {
  Container,
  Title,
  Text,
  Flex,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import Loader from "../common/components/loader/GavelLoader";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import BasePage from "../common/components/BasePage";

export default function DashboardPage() {
  const { user } = useAuth();
  const { assignments, isLoading } = useUserAssignments(user.id);

  const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  useEffect(() => {
    if (
      assignments?.length === 1 &&
      assignments[0]?.school_id !== selectedSchoolId
    )
      setSelectedSchoolId(assignments[0]?.school_id);
  }, [assignments]);

  if (isLoading)
    return (
      <Container>
        <Flex justify="center" mt="xs" align="center">
          <Loader scale={1.5} />
        </Flex>
      </Container>
    );

  return (
    <BasePage titleText="User Dashboard">
      {assignments.length === 0 && (
        <Text>
          You are not assigned to any schools. Please have your school's Primary
          Admin reach out to support to be added.
        </Text>
      )}
    </BasePage>
  );
}
