import { Radio, Group, Space, Divider, Button, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSchoolAssignments } from "../hooks/useSchoolAssignments";
import { ViewAssignments, AddAssignment } from "./AssignmentViews";
import BaseModal from "../../../../common/components/modals/BaseModal";
import { NameField, StatusField } from "../../common/FormFields";

export default function EditSchoolModal({
  opened,
  onClose,
  selected,
  onSubmit,
}) {
  const school = selected;

  const [editType, setEditType] = useState(null);

  const [assignmentView, setAssignmentView] = useState("view");

  const [editAssignmentUserId, setEditAssignmentUserId] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: school?.name,
    short_name: school?.short_name,
    is_premium: school?.is_premium,
  });
  const [schoolId, setSchoolId] = useState(school?.id);

  const {
    assignments,
    availableUsers,
    isLoading: assignmentsLoading,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useSchoolAssignments(schoolId);

  useEffect(() => {
    if (school) {
      setEditType(null);
      setAssignmentView("view");
      setEditAssignmentUserId(null);
      setFormLoading(false);
      setFormValues({
        name: school.name || "",
        short_name: school.short_name || "",
        is_premium: school.is_premium !== undefined ? school.is_premium : false,
      });
      setSchoolId(school.id);
    }
  }, [school]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await onSubmit({
        id: school.id,
        updates: {
          ...(formValues.name !== school.name && { name: formValues.name }),
          ...(formValues.short_name !== school.short_name && {
            short_name: formValues.short_name,
          }),
          ...(formValues.is_premium !== school.is_premium && {
            is_premium: formValues.is_premium,
          }),
        },
      });
      onClose();
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      title={`Edit School (${school?.name})`}
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
            <Radio value="detail" label="School Details" data-autofocus />
            <Radio value="assignment" label="School Assignments" />
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
            <NameField
              value={formValues.name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <NameField
              value={formValues.short_name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, short_name: e.target.value }))
              }
              label="Short Name"
            />
            <StatusField
              value={formValues.is_premium}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, is_premium: e.target.checked }))
              }
              questionLabel="Premium Status"
            />
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
                      setEditAssignmentUserId(data.userId);
                      updateAssignment(data);
                    }}
                    editUserId={editAssignmentUserId}
                    setEditUserId={setEditAssignmentUserId}
                    school={school}
                  />
                </>
              )}

              {assignmentView === "add" && (
                <AddAssignment
                  onAdd={(data) => addAssignment(data)}
                  availableUsers={availableUsers}
                  isLoading={assignmentsLoading}
                  setType={setAssignmentView}
                  school={school}
                  assignments={assignments}
                />
              )}
            </Stack>
          </>
        )}
      </form>
    </BaseModal>
  );
}
