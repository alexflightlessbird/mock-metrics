import {
  Space,
  Title,
  Switch,
  Text,
  Flex,
  Checkbox,
  Group,
  Divider,
} from "@mantine/core";
import PageSection from "../../../common/components/PageSection";
import ScoreTable from "./ScoreTable";
import { useEffect, useState } from "react";
import {
  condenseStudentBySide,
  condenseStudentByTeam,
  condenseStudentByTeamAndSide,
} from "../utils/condenseStudents";

export default function OverallScoresSection({ attorneys, witnesses }) {
  const [condenseAttByTeam, setCondenseAttByTeam] = useState(false);
  const [condenseAttBySide, setCondenseAttBySide] = useState(false);
  const [condenseWitByTeam, setCondenseWitByTeam] = useState(false);
  const [condenseWitBySide, setCondenseWitBySide] = useState(false);

  const [includeArchivedAtts, setIncludeArchivedAtts] = useState(true);
  const [includeArchivedWits, setIncludeArchivedWits] = useState(true);

  const [attorneysToDisplay, setAttorneysToDisplay] = useState(attorneys);
  const [witnessesToDisplay, setWitnessesToDisplay] = useState(witnesses);

  useEffect(() => {
    let condensedAttorneys = attorneys;

    if (condenseAttByTeam && !condenseAttBySide) {
      condensedAttorneys = condenseStudentByTeam(attorneys, "attorney");
    }

    if (!condenseAttByTeam && condenseAttBySide) {
      condensedAttorneys = condenseStudentBySide(attorneys, "attorney");
    }

    if (condenseAttByTeam && condenseAttBySide) {
      condensedAttorneys = condenseStudentByTeamAndSide(attorneys, "attorney");
    }

    if (!includeArchivedAtts) {
      condensedAttorneys = condensedAttorneys.filter(
        (att) => att.student.is_active,
      );
    }

    setAttorneysToDisplay(condensedAttorneys);
  }, [condenseAttByTeam, condenseAttBySide, includeArchivedAtts]);

  useEffect(() => {
    let condensedWitnesses = witnesses;

    if (condenseWitByTeam && !condenseWitBySide) {
      condensedWitnesses = condenseStudentByTeam(witnesses, "witness");
    }

    if (!condenseWitByTeam && condenseWitBySide) {
      condensedWitnesses = condenseStudentBySide(witnesses, "witness");
    }

    if (condenseWitByTeam && condenseWitBySide) {
      condensedWitnesses = condenseStudentByTeamAndSide(witnesses, "witness");
    }

    if (!includeArchivedWits) {
      condensedWitnesses = condensedWitnesses.filter(
        (wit) => wit.student.is_active,
      );
    }

    setWitnessesToDisplay(condensedWitnesses);
  }, [condenseWitByTeam, condenseWitBySide, includeArchivedWits]);

  return (
    <>
      <PageSection title="overall scores - attorneys" collapsible defaultOpen>
        <Group justify="space-between" wrap="wrap">
          <Flex align="center" gap="xs" direction="row" wrap="wrap">
            <Text>Condense by:</Text>
            <Checkbox
              label="Team"
              checked={condenseAttByTeam}
              onChange={(event) =>
                setCondenseAttByTeam(event.currentTarget.checked)
              }
            />
            <Checkbox
              label="Side"
              checked={condenseAttBySide}
              onChange={(event) =>
                setCondenseAttBySide(event.currentTarget.checked)
              }
            />
          </Flex>
          <Divider orientation="vertical" />
          <Flex align="center" gap="xs" direction="row" wrap="wrap">
            <Text>Show archived attorneys:</Text>
            <Switch
              checked={includeArchivedAtts}
              onChange={(event) =>
                setIncludeArchivedAtts(event.currentTarget.checked)
              }
            />
          </Flex>
        </Group>
        <ScoreTable
          type="attorney"
          showTeam={true}
          allScores={attorneysToDisplay}
        />
      </PageSection>

      <Space h="md" />

      <PageSection title="overall scores - witnesses" collapsible defaultOpen>
        <Group justify="space-between" wrap="wrap">
          <Flex align="center" gap="xs" direction="row" wrap="wrap">
            <Text>Condense by:</Text>
            <Checkbox
              label="Team"
              checked={condenseWitByTeam}
              onChange={(event) =>
                setCondenseWitByTeam(event.currentTarget.checked)
              }
            />
            <Checkbox
              label="Side"
              checked={condenseWitBySide}
              onChange={(event) =>
                setCondenseWitBySide(event.currentTarget.checked)
              }
            />
          </Flex>
          <Divider orientation="vertical" />
          <Flex align="center" gap="xs" direction="row" wrap="wrap">
            <Text>Show archived witnesses:</Text>
            <Switch
              checked={includeArchivedWits}
              onChange={(event) =>
                setIncludeArchivedWits(event.currentTarget.checked)
              }
            />
          </Flex>
        </Group>
        <ScoreTable
          type="witness"
          showTeam={true}
          allScores={witnessesToDisplay}
        />
      </PageSection>
    </>
  );
}
