import List from "../../../common/components/List";
import { Link } from "react-router-dom";
import { Text, Checkbox, Flex, TextInput, Modal, Select, NumberInput } from "@mantine/core";
import { hasLength, isInRange, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import { EditIcon } from "../../../common/components/ActionIcons";
import IconButton from "../../../common/components/IconButton";
import { useSchoolDataMutations, useSchoolTeamsTournaments } from "../../../hooks/api/useSchoolData";
import { useCases } from "../../../hooks/api/useCases";
import Loading from "../../../common/components/Loading";
import EntityHeader from "../components/EntityHeader";

export default function SingleTournamentView({ selectedTournament, schoolRole }) {
  const { updateTournament } = useSchoolDataMutations();

  const { data: allCases = [], isPending: isCasesPending } = useCases();
  const { data: allTeamsTournaments = [], isPending: isTeamsTournamentsPending } = useSchoolTeamsTournaments(selectedTournament.school_id);
  
  const linkedCase = allCases.find((c) => c.id === selectedTournament.case_id);

  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () => editTournamentForm.setValues({
      name: selectedTournament.name,
      active: selectedTournament.is_active,
      year: selectedTournament.year,
      type: selectedTournament.type,
      area: selectedTournament.area,
      caseId: linkedCase.id.toString()
    }),
    onClose: () => editTournamentForm.reset(),
  });

  const editTournamentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
      year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });
  
  if (isCasesPending || isTeamsTournamentsPending) return <Loading />;

  const handleEditTournamentSubmit = async (values) => {
    const { name, active, year, type, area, caseId } = values;
    const originalName = selectedTournament.name;
    const originalActive = selectedTournament.active;
    const originalYear = selectedTournament.year;
    const originalType = selectedTournament.type;
    const originalArea = selectedTournament.area;
    const originalCaseId = selectedTournament.case_id;

    const parsedCaseId = Number(caseId);

    const nameChanged  = name !== originalName;
    const statusChanged = active !== originalActive;
    const yearChanged = year !== originalYear;
    const typeChanged = type !== originalType;
    const areaChanged = area !== originalArea;
    const caseChanged = parsedCaseId !== originalCaseId;

    if (!nameChanged && !statusChanged && !yearChanged && !typeChanged && !areaChanged && !caseChanged) {
      close();
      return;
    }

    try {
      await updateTournament({
        tournamentId: selectedTournament.id,
        schoolId: selectedTournament.school_id,
        year: yearChanged ? year : undefined,
        type: typeChanged ? type : undefined,
        name: nameChanged ? name : undefined,
        area: areaChanged ? area : undefined,
        is_active: statusChanged ? active : undefined,
        caseId: caseChanged ? parsedCaseId : undefined,
      });
      close();
    } catch (error) {
      console.error("Tournament update failed:", error);
    }
  }

  const caseOptions = [
    ...allCases.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    })),
  ];

  const typeOptions = [
    { value: "Pre-Stack", label: "Pre-Stack" },
    { value: "Post-Stack", label: "Post-Stack" }
  ];

  const areaOptions = [
    { value: "Invitational", label: "Invitational" },
    { value: "Regionals", label: "Regionals" },
    { value: "ORCS", label: "ORCS" },
    { value: "Nationals", label: "Nationals" },
    { value: "Rookie Rumble", label: "Rookie Rumble" },
    { value: "OLT", label: "OLT" },
    { value: "Other", label: "Other" }
  ];

  const caseItem = <Link to={`/cases?caseId=${selectedTournament.case_id}`}>{linkedCase.name}</Link>;

  const detailItems = [
    `Year: ${selectedTournament.year}`,
    `Type: ${selectedTournament.type}`,
    `Area: ${selectedTournament.area}`,
    `Status: ${selectedTournament.is_active ? "Active" : "Inactive"}`,
    <Text>Linked Case: {caseItem}</Text>
  ]

  return (
    <>
      <EntityHeader title={selectedTournament.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={open} />
      {(schoolRole === ROLES.PRIMARY || schoolRole === ROLES.ADMIN) && (
        <Modal opened={opened} onClose={close} title="Edit Tournament" centered={true}>
          <form onSubmit = {editTournamentForm.onSubmit(
            handleEditTournamentSubmit,
            (errors) => {
              const firstErrorPath = Object.keys(errors)[0];
              editTournamentForm.getInputNode(firstErrorPath)?.focus();
            }
          )}
          >
            <TextInput
              data-autofocus
              placeholder="Enter the tournament's name"
              withAsterisk
              label="Name"
              {...editTournamentForm.getInputProps("name")}
            />
            <br />
            <Select
              label="Type"
              allowDeselect={false}
              data={typeOptions}
              {...editTournamentForm.getInputProps("type")}
            />
            <br />
            <Select
              label="Area"
              allowDeselect={false}
              data={areaOptions}
              {...editTournamentForm.getInputProps("area")}
            />
            <br />
            <NumberInput
              placeholder="Enter the tournament's year"
              withAsterisk
              label="Year"
              allowNegative={false}
              allowDecimal={false}
              min={1985}
              max={new Date().getFullYear()}
              {...editTournamentForm.getInputProps("year")}
            />
            <br />
            <Select
              label="Linked Case"
              allowDeselect={false}
              data={caseOptions}
              {...editTournamentForm.getInputProps("caseId")}
            />
            <br />
            <Checkbox
              label="Active"
              style={{ cursor: "pointer" }}
              {...editTournamentForm.getInputProps("active", {
                type: "checkbox"
              })}
            />
            <br />
            <IconButton icon="save" type="submit" buttonText="Submit" />
          </form>
        </Modal>
      )}
      <List items={detailItems} />
    </>
  );
}
