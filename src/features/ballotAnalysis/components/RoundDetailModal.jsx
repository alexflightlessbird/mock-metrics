import { Group, Space, Stack, Text } from "@mantine/core";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import ShowIdText from "../../../common/components/ShowIdText";
import PageSection from "../../../common/components/PageSection";
import RoundRoleTable from "./RoundRoleTable";
import RoundStudentTable from "./RoundStudentTable";

export default function RoundDetailModal({
  tournamentName,
  teamName,
  round,
  trigger,
}) {
  return (
    <BaseModal
      modalId={`round-detail-modal-${round.id}`}
      title={`Round Detail - ${teamName}`}
      trigger={trigger}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Tournament
          </Text>
          <Text fz="sm">{tournamentName}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Round Number
          </Text>
          <Text fz="sm">{round.round_number}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Side
          </Text>
          <Text fz="sm">{round.side.toUpperCase()}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Ballots
          </Text>
          <Text fz="sm">{round.ballots}</Text>
        </Stack>
        <ShowIdText idName="Round" idValue={round.id} fz="sm" />
      </Group>

      <Space h="md" />

      <PageSection title="roles" collapsible={true} defaultOpen={true}>
        <RoundRoleTable
          role_rounds={round.role_rounds}
          side={round.side}
          witness_rounds={round.witness_rounds}
        />
      </PageSection>

      <Space h="md" />

      <PageSection title="scores" collapsible={true} defaultOpen={true}>
        <RoundStudentTable
          role_rounds={round.role_rounds}
          calculations={round.calculations}
          side={round.side}
          witness_rounds={round.witness_rounds}
        />
      </PageSection>
    </BaseModal>
  );
}
