import {
	Modal,
	Radio,
	Button,
	Group,
	Stack,
	Text,
	Box,
	Select,
	MultiSelect,
	Table,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useAddRound } from "../hooks/useAddRound";
import useNotifications from "../../../common/hooks/useNotifications";
import { useCaseDetails } from "../../../common/hooks/useCaseDetails";
import Loader from "../../../common/components/loader/GavelLoader";
import { useTeamStudents } from "../../../common/hooks/useTeamDetails";

export default function AddRoundModal({
	opened,
	onClose,
	existingRounds,
	caseType,
	nationalsTournament = false,
	tournamentId,
	teamId,
	caseId,
}) {
	const [activePage, setActivePage] = useState(0);
	const [formData, setFormData] = useLocalStorage({
		key: `add-round-form-${teamId}`,
		defaultValue: {
			roundNumber: null,
			side: null,
			attorneys: [],
			witnesses: [],
			pw1: null,
			pw2: null,
			pw3: null,
			dw1: null,
			dw2: null,
			dw3: null,
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

	const { data: caseDetail, isLoading: caseLoading } = useCaseDetails(caseId);
	const { data: students, isLoading: studentsLoading } =
		useTeamStudents(teamId);

	useEffect(() => {
		if (opened) {
			setActivePage(0);
		}
	}, [opened]);

	if (caseLoading || studentsLoading)
		return (
			<Modal
				opened={opened}
				onClose={onClose}
				title="Loading..."
				size="md"
				centered
			>
				<Box py="xl">
					<Loader />
				</Box>
			</Modal>
		);

	const validateCurrentPage = () => {
		switch (activePage) {
			case 0:
				return formData.roundNumber !== null && formData.side !== null;
			case 1:
				return (
					formData.attorneys.length === 3 && formData.witnesses.length === 3
				);
			case 2:
				return (
					formData.pw1 !== null &&
					formData.pw2 !== null &&
					formData.pw3 !== null &&
					formData.dw1 !== null &&
					formData.dw2 !== null &&
					formData.dw3 !== null
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
			attorneys: [],
			witnesses: [],
			pw1: null,
			pw2: null,
			pw3: null,
			dw1: null,
			dw2: null,
			dw3: null,
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
					{ id: formData.pw1, role_type: "p1" },
					{ id: formData.pw2, role_type: "p2" },
					{ id: formData.pw3, role_type: "p3" },
					{ id: formData.dw1, role_type: "d1" },
					{ id: formData.dw2, role_type: "d2" },
					{ id: formData.dw3, role_type: "d3" },
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
					onClose();
					localStorage.removeItem(`add-round-form-${teamId}`);
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
						[roleType]: {
							...prev[roleType],
							p4: value,
						},
					}));
					break;
				case "p6":
					setFormData((prev) => ({
						...prev,
						[roleType]: {
							...prev[roleType],
							p7: value,
						},
					}));
					break;
				case "p9":
					setFormData((prev) => ({
						...prev,
						[roleType]: {
							...prev[roleType],
							p10: value,
						},
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
						[roleType]: {
							...prev[roleType],
							d7: value,
						},
					}));
					break;
				case "d9":
					setFormData((prev) => ({
						...prev,
						[roleType]: {
							...prev[roleType],
							d10: value,
						},
					}));
					break;
				case "d12":
					setFormData((prev) => ({
						...prev,
						[roleType]: {
							...prev[roleType],
							d13: value,
						},
					}));
					break;
				default:
					break;
			}
		}
	};

	const roundOptions = nationalsTournament ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
	const sideOptions =
		caseType === "civil"
			? ["Plaintiff", "Defense"]
			: caseType === "criminal"
			? ["Prosecution", "Defense"]
			: ["Plaintiff/Prosecution", "Defense"];

	const studentOptions = students.map((s) => {
		return {
			label: s.students.name,
			value: s.student_id,
		};
	});
	const attorneyOptions = studentOptions.map((s) => {
		return {
			...s,
			disabled: formData.witnesses.includes(s.value),
		};
	});
	const witnessOptions = studentOptions.map((s) => {
		return {
			...s,
			disabled: formData.attorneys.includes(s.value),
		};
	});

	const caseWitnessOptions = caseDetail.witnesses.map((w) => {
		return {
			label: w.name,
			value: w.id,
			side: w.side,
		};
	});

	const pWitnesses = caseWitnessOptions.filter((w) => w.side === "p");
	const dWitnesses = caseWitnessOptions.filter((w) => w.side === "d");
	const sWitnesses = caseWitnessOptions.filter((w) => w.side === "s");

	const pWitnessOptions = [
		{
			group: "P Only",
			items: pWitnesses.map((w) => {
				return {
					...w,
					disabled:
						formData.pw1 === w.value ||
						formData.pw2 === w.value ||
						formData.pw3 === w.value ||
						formData.dw1 === w.value ||
						formData.dw2 === w.value ||
						formData.dw3 === w.value,
				};
			}),
		},
		{
			group: "Swing",
			items: sWitnesses.map((w) => {
				return {
					...w,
					disabled:
						formData.pw1 === w.value ||
						formData.pw2 === w.value ||
						formData.pw3 === w.value ||
						formData.dw1 === w.value ||
						formData.dw2 === w.value ||
						formData.dw3 === w.value,
				};
			}),
		},
	];

	const dWitnessOptions = [
		{
			group: "D Only",
			items: dWitnesses.map((w) => {
				return {
					...w,
					disabled:
						formData.pw1 === w.value ||
						formData.pw2 === w.value ||
						formData.pw3 === w.value ||
						formData.dw1 === w.value ||
						formData.dw2 === w.value ||
						formData.dw3 === w.value,
				};
			}),
		},
		{
			group: "Swing",
			items: sWitnesses.map((w) => {
				return {
					...w,
					disabled:
						formData.pw1 === w.value ||
						formData.pw2 === w.value ||
						formData.pw3 === w.value ||
						formData.dw1 === w.value ||
						formData.dw2 === w.value ||
						formData.dw3 === w.value,
				};
			}),
		},
	];

	const attorneyStudentOptions = formData.attorneys.map((id) => {
		const student = students.find((s) => s.student_id === id);
		return {
			value: id,
			label: student ? student.students.name : `Unknown (ID: ${id})`,
		};
	});

	const witnessStudentOptions = formData.witnesses.map((id) => {
		const student = students.find((s) => s.student_id === id);
		return {
			value: id,
			label: student ? student.students.name : `Unknown (ID: ${id})`,
		};
	});

	const getWitnessName = (witId) => {
		const witness = caseDetail.witnesses.find((w) => w.id === witId);
		return witness ? witness.name : `Unknown (ID: ${witId})`;
	};

	const pages = [
		// Page 0: Round and side selection
		<Stack key={0}>
			<Text size="sm" c="dimmed">
				Select the round number
			</Text>
			<Radio.Group
				value={formData.roundNumber}
				onChange={(value) => handleInputChange("roundNumber", value)}
				name="roundNumber"
			>
				<Stack mt="xs">
					{roundOptions.map((num) => (
						<Radio
							key={num}
							value={num.toString()}
							label={`Round ${num}`}
							disabled={existingRounds.includes(num)}
						/>
					))}
				</Stack>
			</Radio.Group>

			<Text size="sm" c="dimmed">
				Select the side
			</Text>
			<Radio.Group
				value={formData.side}
				onChange={(value) => handleInputChange("side", value)}
				name="side"
			>
				<Stack mt="xs">
					{sideOptions.map((side) => (
						<Radio
							key={side}
							value={side.toLowerCase().slice(0, 1)}
							label={side}
						/>
					))}
				</Stack>
			</Radio.Group>
		</Stack>,

		// Page 1: Student selection (attorneys and witnesses)
		<Stack key={1}>
			<Text size="sm" c="dimmed">
				Select the students participating in this round. The order doesn't
				matter.
			</Text>
			<MultiSelect
				data={attorneyOptions}
				value={formData.attorneys}
				onChange={(value) => handleInputChange("attorneys", value)}
				label="Attorneys"
				maxValues={3}
				clearable
				hidePickedOptions
			/>
			<MultiSelect
				data={witnessOptions}
				value={formData.witnesses}
				onChange={(value) => handleInputChange("witnesses", value)}
				label="Witnesses"
				maxValues={3}
				clearable
				hidePickedOptions
			/>
		</Stack>,

		// Page 2: Witness selection
		<Stack key={2}>
			<Text size="sm" c="dimmed">
				Assign{" "}
				{caseType === "civil"
					? "Plaintiff"
					: caseType === "criminal"
					? "Prosecution"
					: "Plaintiff/Prosecution"}{" "}
				Witnesses
			</Text>
			<Select
				data={pWitnessOptions}
				value={formData.pw1}
				onChange={(value) => handleInputChange("pw1", value)}
				clearable
				label={`${
					caseType === "civil"
						? "Plaintiff"
						: caseType === "criminal"
						? "Prosecution"
						: "Plaintiff/Prosecution"
				} Witness 1`}
			/>
			<Select
				data={pWitnessOptions}
				value={formData.pw2}
				onChange={(value) => handleInputChange("pw2", value)}
				clearable
				label={`${
					caseType === "civil"
						? "Plaintiff"
						: caseType === "criminal"
						? "Prosecution"
						: "Plaintiff/Prosecution"
				} Witness 2`}
			/>
			<Select
				data={pWitnessOptions}
				value={formData.pw3}
				onChange={(value) => handleInputChange("pw3", value)}
				clearable
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
			<Select
				data={dWitnessOptions}
				value={formData.dw1}
				onChange={(value) => handleInputChange("dw1", value)}
				clearable
				label="Defense Witness 1"
			/>
			<Select
				data={dWitnessOptions}
				value={formData.dw2}
				onChange={(value) => handleInputChange("dw2", value)}
				clearable
				label="Defense Witness 2"
			/>
			<Select
				data={dWitnessOptions}
				value={formData.dw3}
				onChange={(value) => handleInputChange("dw3", value)}
				clearable
				label="Defense Witness 3"
			/>
		</Stack>,

		// Page 3: Role selection (who did what)
		<Stack key={3}>
			{formData.side === "p" && (
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
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p1 === a.value ||
												formData.pRoles.p14 === a.value,
										};
									})}
									value={formData.pRoles.p1}
									onChange={(value) => handleRoleChange("pRoles", "p1", value)}
									clearable
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
								{getWitnessName(formData.pw1)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p2 === a.value ||
												formData.pRoles.p5 === a.value ||
												formData.pRoles.p8 === a.value,
										};
									})}
									value={formData.pRoles.p2}
									onChange={(value) => handleRoleChange("pRoles", "p2", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td>
								<Select
									data={witnessStudentOptions.map((w) => {
										return {
											...w,
											disabled:
												formData.pRoles.p3 === w.value ||
												formData.pRoles.p6 === w.value ||
												formData.pRoles.p9 === w.value,
										};
									})}
									value={formData.pRoles.p3}
									onChange={(value) => handleRoleChange("pRoles", "p3", value)}
									clearable
								/>
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								P2
								<br />
								{getWitnessName(formData.pw2)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p2 === a.value ||
												formData.pRoles.p5 === a.value ||
												formData.pRoles.p8 === a.value,
										};
									})}
									value={formData.pRoles.p5}
									onChange={(value) => handleRoleChange("pRoles", "p5", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td>
								<Select
									data={witnessStudentOptions.map((w) => {
										return {
											...w,
											disabled:
												formData.pRoles.p3 === w.value ||
												formData.pRoles.p6 === w.value ||
												formData.pRoles.p9 === w.value,
										};
									})}
									value={formData.pRoles.p6}
									onChange={(value) => handleRoleChange("pRoles", "p6", value)}
									clearable
								/>
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								P3
								<br />
								{getWitnessName(formData.pw3)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p2 === a.value ||
												formData.pRoles.p5 === a.value ||
												formData.pRoles.p8 === a.value,
										};
									})}
									value={formData.pRoles.p8}
									onChange={(value) => handleRoleChange("pRoles", "p8", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td>
								<Select
									data={witnessStudentOptions.map((w) => {
										return {
											...w,
											disabled:
												formData.pRoles.p3 === w.value ||
												formData.pRoles.p6 === w.value ||
												formData.pRoles.p9 === w.value,
										};
									})}
									value={formData.pRoles.p9}
									onChange={(value) => handleRoleChange("pRoles", "p9", value)}
									clearable
								/>
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
								{getWitnessName(formData.dw1)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p11 === a.value ||
												formData.pRoles.p12 === a.value ||
												formData.pRoles.p13 === a.value,
										};
									})}
									value={formData.pRoles.p11}
									onChange={(value) => handleRoleChange("pRoles", "p11", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td align="center">-</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								D2
								<br />
								{getWitnessName(formData.dw2)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p11 === a.value ||
												formData.pRoles.p12 === a.value ||
												formData.pRoles.p13 === a.value,
										};
									})}
									value={formData.pRoles.p12}
									onChange={(value) => handleRoleChange("pRoles", "p12", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td align="center">-</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								D3
								<br />
								{getWitnessName(formData.dw3)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p11 === a.value ||
												formData.pRoles.p12 === a.value ||
												formData.pRoles.p13 === a.value,
										};
									})}
									value={formData.pRoles.p13}
									onChange={(value) => handleRoleChange("pRoles", "p13", value)}
									clearable
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
							<Table.Td>Closing</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.pRoles.p1 === a.value ||
												formData.pRoles.p14 === a.value,
										};
									})}
									value={formData.pRoles.p14}
									onChange={(value) => handleRoleChange("pRoles", "p14", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td align="center">-</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
			)}
			{formData.side === "d" && (
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
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d1 === a.value ||
												formData.dRoles.d14 === a.value,
										};
									})}
									value={formData.dRoles.d1}
									onChange={(value) => handleRoleChange("dRoles", "d1", value)}
									clearable
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
								{getWitnessName(formData.pw1)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d2 === a.value ||
												formData.dRoles.d3 === a.value ||
												formData.dRoles.d4 === a.value,
										};
									})}
									value={formData.dRoles.d2}
									onChange={(value) => handleRoleChange("dRoles", "d2", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td align="center">-</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								P2
								<br />
								{getWitnessName(formData.pw2)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d2 === a.value ||
												formData.dRoles.d3 === a.value ||
												formData.dRoles.d4 === a.value,
										};
									})}
									value={formData.dRoles.d3}
									onChange={(value) => handleRoleChange("dRoles", "d3", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td align="center">-</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								P3
								<br />
								{getWitnessName(formData.pw3)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d2 === a.value ||
												formData.dRoles.d3 === a.value ||
												formData.dRoles.d4 === a.value,
										};
									})}
									value={formData.dRoles.d4}
									onChange={(value) => handleRoleChange("dRoles", "d4", value)}
									clearable
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
								D1
								<br />
								{getWitnessName(formData.dw1)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d5 === a.value ||
												formData.dRoles.d8 === a.value ||
												formData.dRoles.d11 === a.value,
										};
									})}
									value={formData.dRoles.d5}
									onChange={(value) => handleRoleChange("dRoles", "d5", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td>
								<Select
									data={witnessStudentOptions.map((w) => {
										return {
											...w,
											disabled:
												formData.dRoles.d6 === w.value ||
												formData.dRoles.d9 === w.value ||
												formData.dRoles.d12 === w.value,
										};
									})}
									value={formData.dRoles.d6}
									onChange={(value) => handleRoleChange("dRoles", "d6", value)}
									clearable
								/>
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								D2
								<br />
								{getWitnessName(formData.dw2)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d5 === a.value ||
												formData.dRoles.d8 === a.value ||
												formData.dRoles.d11 === a.value,
										};
									})}
									value={formData.dRoles.d8}
									onChange={(value) => handleRoleChange("dRoles", "d8", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td>
								<Select
									data={witnessStudentOptions.map((w) => {
										return {
											...w,
											disabled:
												formData.dRoles.d6 === w.value ||
												formData.dRoles.d9 === w.value ||
												formData.dRoles.d12 === w.value,
										};
									})}
									value={formData.dRoles.d9}
									onChange={(value) => handleRoleChange("dRoles", "d9", value)}
									clearable
								/>
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>
								D3
								<br />
								{getWitnessName(formData.dw3)}
							</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d5 === a.value ||
												formData.dRoles.d8 === a.value ||
												formData.dRoles.d11 === a.value,
										};
									})}
									value={formData.dRoles.d11}
									onChange={(value) => handleRoleChange("dRoles", "d11", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td>
								<Select
									data={witnessStudentOptions.map((w) => {
										return {
											...w,
											disabled:
												formData.dRoles.d6 === w.value ||
												formData.dRoles.d9 === w.value ||
												formData.dRoles.d12 === w.value,
										};
									})}
									value={formData.dRoles.d12}
									onChange={(value) => handleRoleChange("dRoles", "d12", value)}
									clearable
								/>
							</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>Closing</Table.Td>
							<Table.Td>
								<Select
									data={attorneyStudentOptions.map((a) => {
										return {
											...a,
											disabled:
												formData.dRoles.d1 === a.value ||
												formData.dRoles.d14 === a.value,
										};
									})}
									value={formData.dRoles.d14}
									onChange={(value) => handleRoleChange("dRoles", "d14", value)}
									clearable
								/>
							</Table.Td>
							<Table.Td align="center">-</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
			)}
		</Stack>,
	];

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Add Round (Step ${activePage + 1} of 4)`}
			size="xl"
			centered
			styles={{
				content: { maxHeight: "80%", overflowY: "auto" },
				body: { overflowY: "auto" },
			}}
		>
			{pages[activePage]}

			<Group justify="space-between" mt="xl">
				{activePage !== 0 ? (
					<Button variant="default" onClick={handleBack}>
						Back
					</Button>
				) : (
					<Button variant="default" onClick={handleReset}>
						Reset
					</Button>
				)}

				{activePage < pages.length - 1 ? (
					<Button onClick={handleNext} disabled={!validateCurrentPage()}>
						Next
					</Button>
				) : (
					<Button onClick={handleSubmit} disabled={!validateCurrentPage()}>
						Submit
					</Button>
				)}
			</Group>
		</Modal>
	);
}
