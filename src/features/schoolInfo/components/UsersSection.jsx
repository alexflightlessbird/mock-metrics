import { useState } from "react";
import {
  ActionIcon,
  Button,
  Flex,
  Grid,
  Group,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  LuCheck,
  LuPencilLine,
  LuSearch,
  LuTrash,
  LuX,
} from "react-icons/lu";
import {
  useManageSchoolUsers,
  useSchoolUsers,
} from "../../../common/hooks/useSchoolDetails";
import { useGetRole } from "../../../common/hooks/useGetRole";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../../../common/components/loader/GavelLoader";
import PageSection from "../../../common/components/PageSection";
import Card from "../../../common/components/card/Card";
import AddButton from "../../../common/components/AddButton";
import BaseModal from "../../../common/components/modals/BaseModal";

export default function UsersSection({ schoolId, isMobile }) {
  const [newUserId, setNewUserId] = useState("");
  const [newUserRole, setNewUserRole] = useState("viewer");
  const [userToRemove, setUserToRemove] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useGetRole(user?.id, schoolId);
  const canManageUsers = role === "primary" && !roleLoading;

  const { data: assignments = [], isLoading: usersLoading = true } =
    useSchoolUsers(schoolId);
  const { addUser, updateUser, removeUser, isSaving } =
    useManageSchoolUsers(schoolId);

  if (usersLoading)
    return (
      <Stack>
        <Skeleton height={50} width="100%" />
        <Loader scale={1.5} />
      </Stack>
    );

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredAssignments = assignments.filter((entry) => {
    const searchableValues = [
      entry.users?.name,
      entry.users?.email,
      entry.user_id,
    ];
    return searchableValues.some((value) =>
      value?.toLowerCase().includes(normalizedSearch),
    );
  });
  const primaryAdmins = filteredAssignments.filter(
    (entry) => entry.role === "primary",
  );
  const admins = filteredAssignments.filter((entry) => entry.role === "admin");
  const viewers = filteredAssignments.filter(
    (entry) => entry.role === "viewer",
  );

  const handleAddUser = async (event) => {
    event.preventDefault();
    const userId = newUserId.trim();
    if (!userId) return;

    try {
      await addUser({ userId, role: newUserRole });
      setNewUserId("");
      setNewUserRole("viewer");
      setAddModalOpen(false);
    } catch {
      // The mutation reports errors through the app's notification system.
    }
  };

  const handleRoleChange = async (userId, nextRole) => {
    if (!nextRole) return;
    try {
      await updateUser({ userId, role: nextRole });
      setEditingUserId(null);
      setEditingRole(null);
    } catch {
      // The mutation reports errors through the app's notification system.
    }
  };

  const handleRemoveUser = async () => {
    if (!userToRemove) return;
    try {
      await removeUser({ userId: userToRemove.user_id });
      setUserToRemove(null);
    } catch {
      // The mutation reports errors through the app's notification system.
    }
  };

  const UserCards = ({ users, editable = false }) => {
    if (!users.length) return <Text c="dimmed">No users found</Text>;

    return (
      <Grid>
        {users.map((entry) => {
          const isEditing = editingUserId === entry.user_id;
          const name = entry.users?.name || "Unnamed user";

          return (
            <Grid.Col key={entry.user_id} span={{ base: 12, sm: 6, xl: 4 }}>
              <Card expandWhenHover={false} h="100%">
                <Flex justify="space-between" align="flex-start" gap="sm">
                  <Stack gap={4} style={{ minWidth: 0 }}>
                    <Title order={5}>{name}</Title>
                    <Text c="dimmed" size="sm" style={{ overflowWrap: "anywhere" }}>
                      {entry.users?.email || entry.user_id}
                    </Text>
                    {isEditing && (
                      <Select
                        aria-label={`Role for ${name}`}
                        data={[
                          { value: "admin", label: "Admin" },
                          { value: "viewer", label: "Viewer" },
                        ]}
                        value={editingRole}
                        onChange={setEditingRole}
                        disabled={isSaving}
                        w={140}
                        mt="xs"
                      />
                    )}
                  </Stack>
                  {editable && canManageUsers && (
                    <Group gap={4} wrap="nowrap">
                      {isEditing ? (
                        <>
                          <Tooltip label="Save role" withArrow>
                            <ActionIcon
                              aria-label="Save role"
                              onClick={() =>
                                handleRoleChange(entry.user_id, editingRole)
                              }
                              disabled={isSaving || !editingRole}
                            >
                              <LuCheck />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Cancel" withArrow>
                            <ActionIcon
                              aria-label="Cancel role edit"
                              color="gray"
                              onClick={() => {
                                setEditingUserId(null);
                                setEditingRole(null);
                              }}
                              disabled={isSaving}
                            >
                              <LuX />
                            </ActionIcon>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip label="Change role" withArrow>
                            <ActionIcon
                              aria-label={`Change role for ${name}`}
                              variant="subtle"
                              onClick={() => {
                                setEditingUserId(entry.user_id);
                                setEditingRole(entry.role);
                              }}
                              disabled={isSaving}
                            >
                              <LuPencilLine />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Remove access" withArrow>
                            <ActionIcon
                              aria-label={`Remove access for ${name}`}
                              variant="subtle"
                              color="red"
                              onClick={() => setUserToRemove(entry)}
                              disabled={isSaving}
                            >
                              <LuTrash />
                            </ActionIcon>
                          </Tooltip>
                        </>
                      )}
                    </Group>
                  )}
                </Flex>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    );
  };

  return (
    <PageSection title="users" collapsible>
      <Flex
        direction={isMobile ? "column" : "row"}
        gap="sm"
        mb="md"
        align="center"
      >
        <Flex direction="row" flex={1} gap="xs" w={isMobile ? "100%" : undefined}>
          <TextInput
            id="search-school-users"
            w={isMobile ? "100%" : undefined}
            flex={1}
            leftSection={<LuSearch />}
            rightSection={
              searchValue && (
                <ActionIcon
                  variant="transparent"
                  aria-label="Clear user search"
                  onClick={() => {
                    setSearchValue("");
                    document.getElementById("search-school-users")?.focus();
                  }}
                >
                  <LuX />
                </ActionIcon>
              )
            }
            placeholder="Search users..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
          />
        </Flex>
        {canManageUsers && (
          <AddButton
            onClick={() => setAddModalOpen(true)}
            fullWidth={isMobile}
          >
            Add User
          </AddButton>
        )}
      </Flex>

      <Stack gap="sm">
        {normalizedSearch && filteredAssignments.length === 0 ? (
          <Text c="dimmed" ta="center" mt="md">
            No users found.
          </Text>
        ) : (
          <>
            <Title order={4}>Primary Admins</Title>
            {canManageUsers && (
              <Text c="dimmed" size="sm">
                Primary admin changes must be submitted through support.
              </Text>
            )}
            <UserCards users={primaryAdmins} />

            <Title order={4} mt="md">
              Admins
            </Title>
            <UserCards users={admins} editable />

            <Title order={4} mt="md">
              Viewers
            </Title>
            <UserCards users={viewers} editable />
          </>
        )}
      </Stack>

      <BaseModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add User"
      >
        <form onSubmit={handleAddUser}>
          <Stack>
            <TextInput
              label="User ID"
              placeholder="Enter the user's ID"
              value={newUserId}
              onChange={(event) => setNewUserId(event.currentTarget.value)}
              required
              data-autofocus
            />
            <Select
              label="Role"
              data={[
                { value: "admin", label: "Admin" },
                { value: "viewer", label: "Viewer" },
              ]}
              value={newUserRole}
              onChange={(value) => value && setNewUserRole(value)}
              allowDeselect={false}
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={() => setAddModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSaving}
                disabled={!newUserId.trim()}
              >
                Add User
              </Button>
            </Group>
          </Stack>
        </form>
      </BaseModal>

      <BaseModal
        opened={!!userToRemove}
        onClose={() => setUserToRemove(null)}
        title="Remove User Access"
      >
        <Stack>
          <Text>
            Remove {userToRemove?.users?.name || userToRemove?.user_id} from this
            school's access list?
          </Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setUserToRemove(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleRemoveUser} loading={isSaving}>
              Remove Access
            </Button>
          </Group>
        </Stack>
      </BaseModal>
    </PageSection>
  );
}
