import { Text, Tooltip } from "@mantine/core";
import UserList from "../lists/SingleSchool/UserList";
import { PREMIUM_LIMITS } from "../../../../utils/constants";

export default function UsersTabContent({
    isPremium,
    schoolId,
    schoolName,
    primaryAdminUsers,
    adminUsers,
    viewerUsers
}) {
    const premiumTooltipLabel = "Upgrade to premium for unlimited spots";
    const tooltipProps = { inline: true, label: premiumTooltipLabel };
    const userListProps = { isPremium, schoolId, schoolName };

    return (
        <>
            <br />
            <Text>To add additional users, please contact MSU Mock Trial.</Text>
            <h3>
                Primary Admins
                {isPremium ? (
                    <span> ({primaryAdminUsers.length})</span>
                ) : (
                    <Tooltip {...tooltipProps}>
                        <span> ({primaryAdminUsers.length}/{PREMIUM_LIMITS.PRIMARY})</span>
                    </Tooltip>
                )}
            </h3>
            <UserList users={primaryAdminUsers} {...userListProps} />
            <h3>
                Admins
                {isPremium ? (
                    <span> ({adminUsers.length})</span>
                ) : (
                    <Tooltip {...tooltipProps}>
                        <span> ({adminUsers.length}/{PREMIUM_LIMITS.ADMIN})</span>
                    </Tooltip>
                )}
            </h3>
            <UserList users={adminUsers} {...userListProps} />
            <h3>
                Viewers
                {isPremium ? (
                    <span> ({viewerUsers.length})</span>
                ) : (
                    <Tooltip {...tooltipProps}>
                        <span> ({viewerUsers.length}/{PREMIUM_LIMITS.VIEWER})</span>
                    </Tooltip>
                )}
            </h3>
            <UserList users={viewerUsers} {...userListProps} />
        </>
    )
}