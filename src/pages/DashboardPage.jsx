import {
  Container,
  Text,
  Flex,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import Loader from "../common/components/loader/GavelLoader";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import BasePage from "../common/components/BasePage";
import { useUserDetails } from "../common/hooks/useUserDetails";

export default function DashboardPage() {
  const { user } = useAuth();
  const { assignments, isLoading } = useUserAssignments(user.id);

  const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  const [userName, setUserName] = useState("");

  const { data: userDetails, isLoading: isLoadingUserDetails } = useUserDetails(user.id);

  useEffect(() => {
    if (
      assignments?.length === 1 &&
      assignments[0]?.school_id !== selectedSchoolId
    )
      setSelectedSchoolId(assignments[0]?.school_id);
  }, [assignments]);

  useEffect(() => {
    if (userDetails?.name) setUserName(`, ${userDetails.name}`);
  }, [userDetails]);

  if (isLoading || isLoadingUserDetails)
    return (
      <Container>
        <Flex justify="center" mt="xs" align="center">
          <Loader scale={1.5} />
        </Flex>
      </Container>
    );

  return (
    <BasePage titleText="Dashboard">
      {assignments.length === 0 && (
        <Text>
          You are not assigned to any schools. Please have your school's Primary
          Admin reach out to support to be added.
        </Text>
      )}
      <Text>Welcome back{userName}!</Text>
    </BasePage>
  );
}
