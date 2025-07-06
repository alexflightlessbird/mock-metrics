import {
  Input,
  Modal,
  Radio,
  Group,
  Space,
  Divider,
  TextInput,
  Checkbox,
  Button,
  Text,
  Stack,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useUserAssignments } from "../hooks/useUserAssignments";
import { ViewAssignments, AddAssignment } from "./AssignmentViews";

export default function EditUserModal({ opened, onClose, user, onSubmit }) {
  const [editType, setEditType] = useState(null);

  const [assignmentView, setAssignmentView] = useState("view");

  const [editAssignmentOpen, setEditAssignmentOpen] = useState(false);
  const [editAssignmentSchoolId, setEditAssignmentSchoolId] = useState(null);
  const [editAssignmentRole, setEditAssignmentRole] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user?.name,
  });
  const [userId, setUserId] = useState(user?.id);

  const {
    assignments,
    availableSchools,
    isLoading: assignmentsLoading,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useUserAssignments(userId);

  useEffect(() => {
    if (user) {
      setEditType(null);
      setAssignmentView("view");
      setEditAssignmentOpen(false);
      setEditAssignmentSchoolId(null);
      setEditAssignmentRole(null);
      setFormLoading(false);
      setFormValues({
        name: user.name || "",
      });
      setUserId(user.id);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await onSubmit({
        id: user.id,
        updates: {
          ...(formValues.name !== user.name && { name: formValues.name }),
        },
      });
      onClose();
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit User (${user?.name})`}
      centered
      withCloseButton
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
      size="100%"
    >
      <form onSubmit={handleSubmit}>
        <Radio.Group
          name="editOption"
          label="Choose what you want to edit"
          withAsterisk
          value={editType}
          onChange={setEditType}
        >
          <Group>
            <Radio value="detail" label="User Details" data-autofocus />
            <Radio value="assignment" label="User Assignments" />
          </Group>
        </Radio.Group>

        {editType !== null && (
          <>
            <Space h="md" />
            <Divider />
            <Space h="sm" />
          </>
        )}

        {editType === "detail" && (
          <>
            <TextInput
              value={formValues.name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, name: e.target.value }))
              }
              label="User Name"
            />
            <Space h="xs" />
            <Button loading={formLoading} type="submit">
              Submit
            </Button>
          </>
        )}

        {editType === "assignment" && (
          <>
            <Stack>
              <Radio.Group value={assignmentView} onChange={setAssignmentView}>
                <Group>
                  <Radio value="view" label="View Current Assignments" />
                  <Radio value="add" label="Add New Assignment" />
                </Group>
              </Radio.Group>

              {assignmentView === "view" && (
                <>
                  <ViewAssignments
                    assignments={assignments}
                    onRemove={(data) => deleteAssignment(data)}
                    onUpdate={(data) => {
                      setEditAssignmentOpen(true);
                      setEditAssignmentSchoolId(data.schoolId);
                      setEditAssignmentRole(data.role);
                    }}
                    editOpen={editAssignmentOpen}
                    setEditOpen={setEditAssignmentOpen}
                    editSchoolId={editAssignmentSchoolId}
                  />

                  {editAssignmentOpen && (
                    <>
                      <Text>{editAssignmentSchoolId}</Text>
                      <Select
                        value={editAssignmentRole}
                        onChange={setEditAssignmentRole}
                        data={[
                          { value: "primary", label: "Primary Admin" },
                          { value: "admin", label: "Admin" },
                          { value: "viewer", label: "Viewer" },
                        ]}
                      />
                      <Space h="xs" />
                      <Button
                        onClick={() => {
                          updateAssignment({
                            schoolId: editAssignmentSchoolId,
                            role: editAssignmentRole,
                          });
                          setEditAssignmentOpen(false);
                          setEditAssignmentRole(null);
                          setEditAssignmentSchoolId(null);
                        }}
                      >
                        Submit
                      </Button>
                    </>
                  )}
                </>
              )}

              {assignmentView === "add" && (
                <AddAssignment
                  onAdd={(data) => addAssignment(data)}
                  availableSchools={availableSchools}
                  isLoading={assignmentsLoading}
                  setType={setAssignmentView}
                />
              )}
            </Stack>
          </>
        )}
      </form>
    </Modal>
  );
}
