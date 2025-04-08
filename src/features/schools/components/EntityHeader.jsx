// Dependency imports
import { Flex } from "@mantine/core";

// Component imports
import { EditIcon, DeleteIcon } from "../../../common/components/ActionIcons";

export default function EntityHeader({ title, canEdit, onEdit, canDelete, onDelete }) {
    return (
        <Flex style={{ alignItems: "center", gap: "7px" }}>
            <h1>{title}</h1>
            {canEdit && <EditIcon onClick={onEdit} />}
            {canDelete && <DeleteIcon onClick={onDelete} />}
        </Flex>
    )
}