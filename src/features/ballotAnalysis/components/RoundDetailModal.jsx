import { Space } from "@mantine/core";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import PageSection from "../../../common/components/PageSection";
import RoundRoleTable from "./RoundRoleTable";
import RoundStudentTable from "./RoundStudentTable";
import PageDetailSection from "../../../common/components/PageDetailSection";

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
      <PageDetailSection
        details={[
          { name: "Tournament", value: tournamentName },
          { name: "Round Number", value: round.round_number },
          { name: "Side", value: round.side.toUpperCase() },
          { name: "Ballots", value: round.ballots },
          { type: "id", name: "Round", value: round.id }
        ]}
      />

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
