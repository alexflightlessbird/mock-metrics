import { useSessionStorage } from "@mantine/hooks";
import { useAddRound } from "../hooks/useAddRound";
import { useTeamStudents } from "../../../common/hooks/useTeamDetails";
import { useCaseDetails } from "../../../common/hooks/useCaseDetails";
import useNotifications from "../../../common/hooks/useNotifications";
import { useMemo, useState } from "react";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import Loader from "../../../common/components/loader/GavelLoader";
import { useModal } from "../../../context/ModalContext";
import { Group, Button, Stack, Text, Table } from "@mantine/core";
import {
  ModalMultiSelect,
  ModalSelect,
} from "../../../common/components/modals-new/ModalDropdownComponents";
import RadioCardGroup from "../../../common/components/RadioCards";

export default function AddRoundModal({
  onClose,
  trigger,
  existingRounds,
  caseType,
  nationalsTournament = false,
  tournamentId,
  teamId,
  caseId,
}) {
  const [activePage, setActivePage] = useState(0);
  const [formData, setFormData] = useSessionStorage({
    key: `add-round-form-${teamId}`,
    defaultValue: {
      roundNumber: null,
      side: null,
      studentsAttorneys: [],
      studentsWitnesses: [],
      witnesses: {
        pw1: null,
        pw2: null,
        pw3: null,
        dw1: null,
        dw2: null,
        dw3: null,
      },
      pRoles: {
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        p5: null,
        p6: null,
        p7: null,
        p8: null,
        p9: null,
        p10: null,
        p11: null,
        p12: null,
        p13: null,
        p14: null,
      },
      dRoles: {
        d1: null,
        d2: null,
        d3: null,
        d4: null,
        d5: null,
        d6: null,
        d7: null,
        d8: null,
        d9: null,
        d10: null,
        d11: null,
        d12: null,
        d13: null,
        d14: null,
      },
    },
  });

  const { mutate: addRound } = useAddRound();
  const { showError } = useNotifications();
  const { closeModal } = useModal();

  const { data: caseDetail, isLoading: caseLoading } = useCaseDetails(caseId);
  const { data: students, isLoading: studentsLoading } =
    useTeamStudents(teamId);

  const roundOptions = useMemo(
    () => (nationalsTournament ? [1, 2, 3, 4, 5] : [1, 2, 3, 4]),
    [nationalsTournament]
  );
  const sideOptions = useMemo(
    () => [
      {
        value: "p",
        label:
          caseType === "civil"
            ? "Plaintiff"
            : caseType === "criminal"
            ? "Prosecution"
            : "Plaintiff/Prosecution",
      },
      {
        value: "d",
        label: "Defense",
      },
    ],
    [caseType]
  );

  const studentOptions = useMemo(() => {
    if (!students) return [];
    return students.map((s) => ({
      label: s.students.name,
      value: s.student_id,
    }));
  }, [students]);

  const studentAttorneySelectionOptions = useMemo(
    () =>
      studentOptions.map((s) => ({
        ...s,
        disabled: formData.studentsWitnesses?.includes(s.value),
      })),
    [studentOptions, formData.studentsWitnesses]
  );

  const studentWitnessSelectionOptions = useMemo(
    () =>
      studentOptions.map((s) => ({
        ...s,
        disabled: formData.studentsAttorneys?.includes(s.value),
      })),
    [studentOptions, formData.studentsAttorneys]
  );

  const caseWitnessOptions = useMemo(() => {
    if (!caseDetail || !caseDetail?.witnesses) return [];
    return caseDetail.witnesses.map((w) => ({
      label: w.name,
      value: w.id,
      side: w.side,
    }));
  }, [caseDetail, caseDetail?.witnesses]);

  function getWitnessName(witId) {
    const witness = caseWitnessOptions.find((w) => w.value === witId);
    return witness ? witness.label : `Unknown (ID: ${witId})`;
  }

  const pWitnesses = useMemo(
    () => caseWitnessOptions.filter((w) => w.side === "p"),
    [caseWitnessOptions]
  );
  const dWitnesses = useMemo(
    () => caseWitnessOptions.filter((w) => w.side === "d"),
    [caseWitnessOptions]
  );
  const sWitnesses = useMemo(
    () => caseWitnessOptions.filter((w) => w.side === "s"),
    [caseWitnessOptions]
  );

  const pWitnessOptions = useMemo(
    () => [
      {
        group: "P Only",
        items: pWitnesses.map((w) => ({
          ...w,
          disabled:
            formData.witnesses.pw1 === w.value ||
            formData.witnesses.pw2 === w.value ||
            formData.witnesses.pw3 === w.value ||
            formData.witnesses.dw1 === w.value ||
            formData.witnesses.dw2 === w.value ||
            formData.witnesses.dw3 === w.value,
        })),
      },
      {
        group: "Swing",
        items: sWitnesses.map((w) => ({
          ...w,
          disabled:
            formData.witnesses.pw1 === w.value ||
            formData.witnesses.pw2 === w.value ||
            formData.witnesses.pw3 === w.value ||
            formData.witnesses.dw1 === w.value ||
            formData.witnesses.dw2 === w.value ||
            formData.witnesses.dw3 === w.value,
        })),
      },
    ],
    [pWitnesses, sWitnesses, formData.witnesses]
  );
  const dWitnessOptions = useMemo(
    () => [
      {
        group: "D Only",
        items: dWitnesses.map((w) => ({
          ...w,
          disabled:
            formData.witnesses.pw1 === w.value ||
            formData.witnesses.pw2 === w.value ||
            formData.witnesses.pw3 === w.value ||
            formData.witnesses.dw1 === w.value ||
            formData.witnesses.dw2 === w.value ||
            formData.witnesses.dw3 === w.value,
        })),
      },
      {
        group: "Swing",
        items: sWitnesses.map((w) => ({
          ...w,
          disabled:
            formData.witnesses.pw1 === w.value ||
            formData.witnesses.pw2 === w.value ||
            formData.witnesses.pw3 === w.value ||
            formData.witnesses.dw1 === w.value ||
            formData.witnesses.dw2 === w.value ||
            formData.witnesses.dw3 === w.value,
        })),
      },
    ],
    [dWitnesses, sWitnesses, formData.witnesses]
  );

  const studentAttorneyRoleSelectionOptions = useMemo(() => {
    if (!formData.studentsAttorneys) return [];
    return formData.studentsAttorneys.map((id) => {
      const studentName = students?.find((s) => s.student_id === id)?.students
        .name;
      return {
        value: id,
        label: studentName ? studentName : `Unknown (ID: ${id})`,
      };
    });
  }, [students, formData.studentsAttorneys]);

  const studentWitnessRoleSelectionOptions = useMemo(() => {
    if (!formData.studentsWitnesses) return [];
    return formData.studentsWitnesses.map((id) => {
      const studentName = students?.find((s) => s.student_id === id)?.students
        .name;
      return {
        value: id,
        label: studentName ? studentName : `Unknown (ID: ${id})`,
      };
    });
  }, [students, formData.studentsWitnesses]);

  const validateCurrentPage = () => {
    switch (activePage) {
      case 0:
        return formData.roundNumber !== null && formData.side !== null;
      case 1:
        return (
          formData.studentsAttorneys.length === 3 &&
          formData.studentsWitnesses.length === 3
        );
      case 2:
        return (
          formData.witnesses.pw1 !== null &&
          formData.witnesses.pw2 !== null &&
          formData.witnesses.pw3 !== null &&
          formData.witnesses.dw1 !== null &&
          formData.witnesses.dw2 !== null &&
          formData.witnesses.dw3 !== null
        );
      case 3:
        if (formData.side === "p") {
          return (
            formData.pRoles.p1 !== null &&
            formData.pRoles.p2 !== null &&
            formData.pRoles.p3 !== null &&
            formData.pRoles.p4 !== null &&
            formData.pRoles.p5 !== null &&
            formData.pRoles.p6 !== null &&
            formData.pRoles.p7 !== null &&
            formData.pRoles.p8 !== null &&
            formData.pRoles.p9 !== null &&
            formData.pRoles.p10 !== null &&
            formData.pRoles.p11 !== null &&
            formData.pRoles.p12 !== null &&
            formData.pRoles.p13 !== null &&
            formData.pRoles.p14 !== null
          );
        } else if (formData.side === "d") {
          return (
            formData.dRoles.d1 !== null &&
            formData.dRoles.d2 !== null &&
            formData.dRoles.d3 !== null &&
            formData.dRoles.d4 !== null &&
            formData.dRoles.d5 !== null &&
            formData.dRoles.d6 !== null &&
            formData.dRoles.d7 !== null &&
            formData.dRoles.d8 !== null &&
            formData.dRoles.d9 !== null &&
            formData.dRoles.d10 !== null &&
            formData.dRoles.d11 !== null &&
            formData.dRoles.d12 !== null &&
            formData.dRoles.d13 !== null &&
            formData.dRoles.d14 !== null
          );
        } else {
          return false;
        }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      setActivePage(activePage + 1);
    }
  };

  const handleBack = () => {
    setActivePage(activePage - 1);
  };

  const handleReset = () => {
    setActivePage(0);
    setFormData({
      roundNumber: null,
      side: null,
      studentsAttorneys: [],
      studentsWitnesses: [],
      witnesses: {
        pw1: null,
        pw2: null,
        pw3: null,
        dw1: null,
        dw2: null,
        dw3: null,
      },
      pRoles: {
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        p5: null,
        p6: null,
        p7: null,
        p8: null,
        p9: null,
        p10: null,
        p11: null,
        p12: null,
        p13: null,
        p14: null,
      },
      dRoles: {
        d1: null,
        d2: null,
        d3: null,
        d4: null,
        d5: null,
        d6: null,
        d7: null,
        d8: null,
        d9: null,
        d10: null,
        d11: null,
        d12: null,
        d13: null,
        d14: null,
      },
    });
  };

  const handleSubmit = () => {
    if (!validateCurrentPage()) {
      showError({
        title: "Validation Error",
        message: "Please complete all required fields",
      });
      return;
    }

    addRound(
      {
        tournamentId,
        teamId,
        roundNumber: parseInt(formData.roundNumber),
        side: formData.side,
        witnessRoundData: [
          { id: formData.witnesses.pw1, role_type: "p1" },
          { id: formData.witnesses.pw2, role_type: "p2" },
          { id: formData.witnesses.pw3, role_type: "p3" },
          { id: formData.witnesses.dw1, role_type: "d1" },
          { id: formData.witnesses.dw2, role_type: "d2" },
          { id: formData.witnesses.dw3, role_type: "d3" },
        ],
        roleRoundData:
          formData.side === "p"
            ? [
                { id: formData.pRoles.p1, role_type: "p1" },
                { id: formData.pRoles.p2, role_type: "p2" },
                { id: formData.pRoles.p3, role_type: "p3" },
                { id: formData.pRoles.p4, role_type: "p4" },
                { id: formData.pRoles.p5, role_type: "p5" },
                { id: formData.pRoles.p6, role_type: "p6" },
                { id: formData.pRoles.p7, role_type: "p7" },
                { id: formData.pRoles.p8, role_type: "p8" },
                { id: formData.pRoles.p9, role_type: "p9" },
                { id: formData.pRoles.p10, role_type: "p10" },
                { id: formData.pRoles.p11, role_type: "p11" },
                { id: formData.pRoles.p12, role_type: "p12" },
                { id: formData.pRoles.p13, role_type: "p13" },
                { id: formData.pRoles.p14, role_type: "p14" },
              ]
            : [
                { id: formData.dRoles.d1, role_type: "d1" },
                { id: formData.dRoles.d2, role_type: "d2" },
                { id: formData.dRoles.d3, role_type: "d3" },
                { id: formData.dRoles.d4, role_type: "d4" },
                { id: formData.dRoles.d5, role_type: "d5" },
                { id: formData.dRoles.d6, role_type: "d6" },
                { id: formData.dRoles.d7, role_type: "d7" },
                { id: formData.dRoles.d8, role_type: "d8" },
                { id: formData.dRoles.d9, role_type: "d9" },
                { id: formData.dRoles.d10, role_type: "d10" },
                { id: formData.dRoles.d11, role_type: "d11" },
                { id: formData.dRoles.d12, role_type: "d12" },
                { id: formData.dRoles.d13, role_type: "d13" },
                { id: formData.dRoles.d14, role_type: "d14" },
              ],
      },
      {
        onSuccess: () => {
          if (onClose) onClose();
          handleReset();
          closeModal(`add-round-form-${teamId}`);
        },
      }
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWitnessChange = (roleKey, value) => {
    setFormData((prev) => ({
      ...prev,
      witnesses: {
        ...prev.witnesses,
        [roleKey]: value,
      },
    }));
  };

  const handleRoleChange = (roleType, roleKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [roleType]: {
        ...prev[roleType],
        [roleKey]: value,
      },
    }));

    if (roleType.startsWith("p")) {
      switch (roleKey) {
        case "p3":
          setFormData((prev) => ({
            ...prev,
            [roleType]: { ...prev[roleType], p4: value },
          }));
          break;
        case "p6":
          setFormData((prev) => ({
            ...prev,
            [roleType]: { ...prev[roleType], p7: value },
          }));
          break;
        case "p9":
          setFormData((prev) => ({
            ...prev,
            [roleType]: { ...prev[roleType], p10: value },
          }));
          break;
        default:
          break;
      }
    } else if (roleType.startsWith("d")) {
      switch (roleKey) {
        case "d6":
          setFormData((prev) => ({
            ...prev,
            [roleType]: { ...prev[roleType], d7: value },
          }));
          break;
        case "d9":
          setFormData((prev) => ({
            ...prev,
            [roleType]: { ...prev[roleType], d10: value },
          }));
          break;
        case "d12":
          setFormData((prev) => ({
            ...prev,
            [roleType]: { ...prev[roleType], d13: value },
          }));
          break;
        default:
          break;
      }
    }
  };

  const pages = [
    // Page 0: Round and side selection
    <Stack key={0} style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      <Text size="sm" c="dimmed">
        Step 1 of 4: Enter the round details.
      </Text>

      <RadioCardGroup
        label="Select the round number"
        name="roundNumber"
        value={formData.roundNumber}
        options={roundOptions}
        disabledOptions={existingRounds}
        onChange={(name, value) => handleInputChange(name, value)}
      />

      <RadioCardGroup
        label="Select the side"
        name="side"
        value={formData.side}
        options={sideOptions}
        onChange={(name, value) => handleInputChange(name, value)}
      />
    </Stack>,

    // Page 1: Student selection (attorneys and witnesses)
    <Stack key={1}>
      <Text size="sm" c="dimmed">
        Step 2 of 4: Select the students participating in this round. The order
        doesn't matter.
      </Text>

      <ModalMultiSelect
        data={studentAttorneySelectionOptions}
        value={formData.studentsAttorneys}
        onChange={(value) => handleInputChange("studentsAttorneys", value)}
        label="Attorneys"
        maxValues={3}
        clearable
        hidePickedOptions
        nothingFoundMessage="No students found"
      />

      <ModalMultiSelect
        data={studentWitnessSelectionOptions}
        value={formData.studentsWitnesses}
        onChange={(value) => handleInputChange("studentsWitnesses", value)}
        label="Witnesses"
        maxValues={3}
        clearable
        hidePickedOptions
        nothingFoundMessage="No students found"
      />
    </Stack>,

    // Page 2: Witness selection
    <Stack key={2}>
      <Text size="sm" c="dimmed">
        Step 3 of 4: Select the witnesses for this round.
      </Text>

      <Text size="sm" c="dimmed">
        Assign{" "}
        {caseType === "civil"
          ? "Plaintiff"
          : caseType === "criminal"
          ? "Prosecution"
          : "Plaintiff/Prosecution"}{" "}
        Witnesses
      </Text>

      <ModalSelect
        data={pWitnessOptions}
        value={formData.witnesses.pw1}
        onChange={(value) => handleWitnessChange("pw1", value)}
        label={`${
          caseType === "civil"
            ? "Plaintiff"
            : caseType === "criminal"
            ? "Prosecution"
            : "Plaintiff/Prosecution"
        } Witness 1`}
      />
      <ModalSelect
        data={pWitnessOptions}
        value={formData.witnesses.pw2}
        onChange={(value) => handleWitnessChange("pw2", value)}
        label={`${
          caseType === "civil"
            ? "Plaintiff"
            : caseType === "criminal"
            ? "Prosecution"
            : "Plaintiff/Prosecution"
        } Witness 2`}
      />
      <ModalSelect
        data={pWitnessOptions}
        value={formData.witnesses.pw3}
        onChange={(value) => handleWitnessChange("pw3", value)}
        label={`${
          caseType === "civil"
            ? "Plaintiff"
            : caseType === "criminal"
            ? "Prosecution"
            : "Plaintiff/Prosecution"
        } Witness 3`}
      />

      <Text size="sm" c="dimmed">
        Assign Defense Witnesses
      </Text>

      <ModalSelect
        data={dWitnessOptions}
        value={formData.witnesses.dw1}
        onChange={(value) => handleWitnessChange("dw1", value)}
        label="Defense Witness 1"
      />
      <ModalSelect
        data={dWitnessOptions}
        value={formData.witnesses.dw2}
        onChange={(value) => handleWitnessChange("dw2", value)}
        label="Defense Witness 2"
      />
      <ModalSelect
        data={dWitnessOptions}
        value={formData.witnesses.dw3}
        onChange={(value) => handleWitnessChange("dw3", value)}
        label="Defense Witness 3"
      />
    </Stack>,

    // Page 3: Role assignment
    <Stack key={3}>
      <Text size="sm" c="dimmed">
        Step 4 of 4: Assign roles to the selected students.
      </Text>

      <Table striped highlightOnHover withTableBorder fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Td>Role</Table.Td>
            <Table.Td>Attorney</Table.Td>
            <Table.Td>Witness</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Opening</Table.Td>
            <Table.Td>
              <ModalSelect
                data={studentAttorneyRoleSelectionOptions.map((a) => ({
                  ...a,
                  disabled: formData.side
                    ? formData[`${formData.side}Roles`][`${formData.side}1`] ===
                        a.value ||
                      formData[`${formData.side}Roles`][
                        `${formData.side}14`
                      ] === a.value
                    : null,
                }))}
                value={
                  formData.side
                    ? formData[`${formData.side}Roles`][`${formData.side}1`]
                    : null
                }
                onChange={(value) => {
                  if (formData.side) {
                    handleRoleChange(
                      `${formData.side}Roles`,
                      `${formData.side}1`,
                      value
                    );
                  }
                }}
              />
            </Table.Td>
            <Table.Td align="center">-</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} align="center">
              -
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              P1
              <br />
              {getWitnessName(formData.witnesses.pw1)}
            </Table.Td>
            <Table.Td>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.pRoles.p2 === a.value ||
                      formData.pRoles.p5 === a.value ||
                      formData.pRoles.p8 === a.value,
                  }))}
                  value={formData.pRoles.p2}
                  onChange={(value) => handleRoleChange("pRoles", "p2", value)}
                />
              )}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.dRoles.d2 === a.value ||
                      formData.dRoles.d3 === a.value ||
                      formData.dRoles.d4 === a.value,
                  }))}
                  value={formData.dRoles.d2}
                  onChange={(value) => handleRoleChange("dRoles", "d2", value)}
                />
              )}
            </Table.Td>
            <Table.Td align={formData.side === "d" ? "center" : undefined}>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentWitnessRoleSelectionOptions.map((w) => ({
                    ...w,
                    disabled:
                      formData.pRoles.p3 === w.value ||
                      formData.pRoles.p6 === w.value ||
                      formData.pRoles.p9 === w.value,
                  }))}
                  value={formData.pRoles.p3}
                  onChange={(value) => handleRoleChange("pRoles", "p3", value)}
                />
              )}
              {formData.side === "d" && "-"}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              P2
              <br />
              {getWitnessName(formData.witnesses.pw2)}
            </Table.Td>
            <Table.Td>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.pRoles.p2 === a.value ||
                      formData.pRoles.p5 === a.value ||
                      formData.pRoles.p8 === a.value,
                  }))}
                  value={formData.pRoles.p5}
                  onChange={(value) => handleRoleChange("pRoles", "p5", value)}
                />
              )}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.dRoles.d2 === a.value ||
                      formData.dRoles.d3 === a.value ||
                      formData.dRoles.d4 === a.value,
                  }))}
                  value={formData.dRoles.d3}
                  onChange={(value) => handleRoleChange("dRoles", "d3", value)}
                />
              )}
            </Table.Td>
            <Table.Td align={formData.side === "d" ? "center" : undefined}>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentWitnessRoleSelectionOptions.map((w) => ({
                    ...w,
                    disabled:
                      formData.pRoles.p3 === w.value ||
                      formData.pRoles.p6 === w.value ||
                      formData.pRoles.p9 === w.value,
                  }))}
                  value={formData.pRoles.p6}
                  onChange={(value) => handleRoleChange("pRoles", "p6", value)}
                />
              )}
              {formData.side === "d" && "-"}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              P3
              <br />
              {getWitnessName(formData.witnesses.pw3)}
            </Table.Td>
            <Table.Td>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.pRoles.p2 === a.value ||
                      formData.pRoles.p5 === a.value ||
                      formData.pRoles.p8 === a.value,
                  }))}
                  value={formData.pRoles.p8}
                  onChange={(value) => handleRoleChange("pRoles", "p8", value)}
                />
              )}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.dRoles.d2 === a.value ||
                      formData.dRoles.d3 === a.value ||
                      formData.dRoles.d4 === a.value,
                  }))}
                  value={formData.dRoles.d4}
                  onChange={(value) => handleRoleChange("dRoles", "d4", value)}
                />
              )}
            </Table.Td>
            <Table.Td align={formData.side === "d" ? "center" : undefined}>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentWitnessRoleSelectionOptions.map((w) => ({
                    ...w,
                    disabled:
                      formData.pRoles.p3 === w.value ||
                      formData.pRoles.p6 === w.value ||
                      formData.pRoles.p9 === w.value,
                  }))}
                  value={formData.pRoles.p9}
                  onChange={(value) => handleRoleChange("pRoles", "p9", value)}
                />
              )}
              {formData.side === "d" && "-"}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} align="center">
              -
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              D1
              <br />
              {getWitnessName(formData.witnesses.dw1)}
            </Table.Td>
            <Table.Td>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.pRoles.p11 === a.value ||
                      formData.pRoles.p12 === a.value ||
                      formData.pRoles.p13 === a.value,
                  }))}
                  value={formData.pRoles.p11}
                  onChange={(value) => handleRoleChange("pRoles", "p11", value)}
                />
              )}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.dRoles.d5 === a.value ||
                      formData.dRoles.d8 === a.value ||
                      formData.dRoles.d11 === a.value,
                  }))}
                  value={formData.dRoles.d5}
                  onChange={(value) => handleRoleChange("dRoles", "d5", value)}
                />
              )}
            </Table.Td>
            <Table.Td align={formData.side === "p" ? "center" : undefined}>
              {formData.side === "p" && "-"}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentWitnessRoleSelectionOptions.map((w) => ({
                    ...w,
                    disabled:
                      formData.dRoles.d6 === w.value ||
                      formData.dRoles.d9 === w.value ||
                      formData.dRoles.d12 === w.value,
                  }))}
                  value={formData.dRoles.d6}
                  onChange={(value) => handleRoleChange("dRoles", "d6", value)}
                />
              )}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              D2
              <br />
              {getWitnessName(formData.witnesses.dw2)}
            </Table.Td>
            <Table.Td>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.pRoles.p11 === a.value ||
                      formData.pRoles.p12 === a.value ||
                      formData.pRoles.p13 === a.value,
                  }))}
                  value={formData.pRoles.p12}
                  onChange={(value) => handleRoleChange("pRoles", "p12", value)}
                />
              )}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.dRoles.d5 === a.value ||
                      formData.dRoles.d8 === a.value ||
                      formData.dRoles.d11 === a.value,
                  }))}
                  value={formData.dRoles.d8}
                  onChange={(value) => handleRoleChange("dRoles", "d8", value)}
                />
              )}
            </Table.Td>
            <Table.Td align={formData.side === "p" ? "center" : undefined}>
              {formData.side === "p" && "-"}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentWitnessRoleSelectionOptions.map((w) => ({
                    ...w,
                    disabled:
                      formData.dRoles.d6 === w.value ||
                      formData.dRoles.d9 === w.value ||
                      formData.dRoles.d12 === w.value,
                  }))}
                  value={formData.dRoles.d9}
                  onChange={(value) => handleRoleChange("dRoles", "d9", value)}
                />
              )}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              D3
              <br />
              {getWitnessName(formData.witnesses.dw3)}
            </Table.Td>
            <Table.Td>
              {formData.side === "p" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.pRoles.p11 === a.value ||
                      formData.pRoles.p12 === a.value ||
                      formData.pRoles.p13 === a.value,
                  }))}
                  value={formData.pRoles.p13}
                  onChange={(value) => handleRoleChange("pRoles", "p13", value)}
                />
              )}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentAttorneyRoleSelectionOptions.map((a) => ({
                    ...a,
                    disabled:
                      formData.dRoles.d5 === a.value ||
                      formData.dRoles.d8 === a.value ||
                      formData.dRoles.d11 === a.value,
                  }))}
                  value={formData.dRoles.d11}
                  onChange={(value) => handleRoleChange("dRoles", "d11", value)}
                />
              )}
            </Table.Td>
            <Table.Td align={formData.side === "p" ? "center" : undefined}>
              {formData.side === "p" && "-"}
              {formData.side === "d" && (
                <ModalSelect
                  data={studentWitnessRoleSelectionOptions.map((w) => ({
                    ...w,
                    disabled:
                      formData.dRoles.d6 === w.value ||
                      formData.dRoles.d9 === w.value ||
                      formData.dRoles.d12 === w.value,
                  }))}
                  value={formData.dRoles.d12}
                  onChange={(value) => handleRoleChange("dRoles", "d12", value)}
                />
              )}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} align="center">
              -
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Closing</Table.Td>
            <Table.Td>
              <ModalSelect
                data={studentAttorneyRoleSelectionOptions.map((a) => ({
                  ...a,
                  disabled: formData.side
                    ? formData[`${formData.side}Roles`][`${formData.side}1`] ===
                        a.value ||
                      formData[`${formData.side}Roles`][
                        `${formData.side}14`
                      ] === a.value
                    : null,
                }))}
                value={
                  formData.side
                    ? formData[`${formData.side}Roles`][`${formData.side}14`]
                    : null
                }
                onChange={(value) => {
                  if (formData.side) {
                    handleRoleChange(
                      `${formData.side}Roles`,
                      `${formData.side}14`,
                      value
                    );
                  }
                }}
              />
            </Table.Td>
            <Table.Td align="center">-</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>,
  ];

  return (
    <BaseModal
      modalId={`add-round-form-${teamId}`}
      title={caseLoading || studentsLoading ? "Loading..." : "Add Round"}
      trigger={trigger}
      onClose={onClose}
      layer={0}
      footer={
        <>
          <Group justify="space-between">
            <Button onClick={handleReset}>Reset</Button>
            <Group gap="sm">
              <Button onClick={handleBack} disabled={activePage === 0}>
                Back
              </Button>
              <Button
                onClick={
                  activePage === pages.length - 1 ? handleSubmit : handleNext
                }
                disabled={!validateCurrentPage()}
              >
                {activePage === pages.length - 1 ? "Submit" : "Next"}
              </Button>
            </Group>
          </Group>
        </>
      }
    >
      <Text size="sm" weight={500} mb="md">
        Ensure you are entering everything correctly. This information cannot be
        changed after being submitted, and to make adjustments to the details
        you will need to delete the round entirely.
      </Text>
      {(caseLoading || studentsLoading) && <Loader />}
      {!caseLoading && !studentsLoading && pages[activePage]}
    </BaseModal>
  );
}
