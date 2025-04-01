import List from "../../../common/components/List";
import { Link } from "react-router-dom";
import { Text } from "@mantine/core";
import { hasLength, isInRange, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import { TYPES, AREAS } from "../utils/schoolConstants";
import { useSchoolDataMutations, useSchoolTeamsTournaments } from "../../../hooks/api/useSchoolData";
import { useCases } from "../../../hooks/api/useCases";
import Loading from "../../../common/components/Loading";
import EntityHeader from "../components/EntityHeader";
import EditModal from "../components/EditModal";

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
    { value: TYPES.PRESTACK, label: TYPES.PRESTACK },
    { value: TYPES.POSTSTACK, label: TYPES.POSTSTACK }
  ];

  const areaOptions = [
    { value: AREAS.INVITATIONAL, label: AREAS.INVITATIONAL },
    { value: AREAS.REGIONALS, label: AREAS.REGIONALS },
    { value: AREAS.ORCS, label: AREAS.ORCS },
    { value: AREAS.NATIONALS, label: AREAS.NATIONALS },
    { value: AREAS.ROOKIERUMBLE, label: AREAS.ROOKIERUMBLE },
    { value: AREAS.OLT, label: AREAS.OLT },
    { value: AREAS.OTHER, label: AREAS.OTHER }
  ];

  const caseItem = <Link to={`/cases?caseId=${selectedTournament.case_id}`}>{linkedCase.name}</Link>;

  const detailItems = [
    `Year: ${selectedTournament.year}`,
    `Type: ${selectedTournament.type}`,
    `Area: ${selectedTournament.area}`,
    `Status: ${selectedTournament.is_active ? "Active" : "Inactive"}`,
    <Text>Linked Case: {caseItem}</Text>
  ];

  const editModalProps = {
    opened,
    onClose: close,
    title: "Edit Tournament",
    onSubmit: handleEditTournamentSubmit,
    form: editTournamentForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the tournament's name",
        required: true,
        label: "Name",
      },
      {
        type: "select",
        name: "type",
        required: true,
        label: "Type",
        options: typeOptions
      },
      {
        type: "select",
        name: "area",
        required: true,
        label: "Area",
        options: areaOptions
      },
      {
        type: "number",
        name: "year",
        required: true,
        min: 1985,
        max: new Date().getFullYear(),
        label: "Year"
      },
      {
        type: "select",
        name: "caseId",
        required: true,
        label: "Linked Case",
        options: caseOptions
      },
      {
        type: "checkbox",
        name: "active",
        label: "Active"
      }
    ]
  }

  return (
    <>
      <EntityHeader title={selectedTournament.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={open} />
      {(schoolRole === ROLES.PRIMARY || schoolRole === ROLES.ADMIN) && (
        <EditModal {...editModalProps} />
      )}
      <List items={detailItems} />
    </>
  );
}
