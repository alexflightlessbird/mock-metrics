import { useActiveFilters } from "../../../../common/hooks/useActiveFilters";
import TeamList from "../lists/SingleSchool/TeamList";
import TeamFilters from "../filters/TeamFilters";
import IconButton from "../../../../common/components/IconButton";
import AddModal from "../AddModal";
import { useTeamFilters } from "../../hooks/useSingleSchoolTabs";

export default function TeamsTabContent({
    allTeams,
    hasAddPermissions,
    addTeamForm
}) {
    const { active: activeTeams, inactive: inactiveTeams } = useActiveFilters(allTeams);
    const { status, type, setStatus, setType } = useTeamFilters();

    const currentStatus = (status === "inactive" && inactiveTeams.length === 0) || (status === "active" && activeTeams.length === 0) ? "all" : status;

    function getFilteredTeams () {
        let filtered = [];
        switch (status) {
            case "active": filtered = activeTeams; break;
            case "inactive": filtered = inactiveTeams; break;
            case "all": filtered = [...activeTeams, ...inactiveTeams]; break;
            default: filtered = activeTeams; break;
        }

        if (type !== "all") {
            filtered = filtered.filter(t => t.type.toLowerCase() === type);
        }

        return filtered;
    }

    return (
        <>
            <br />
            {hasAddPermissions && (
                <>
                    <IconButton icon="add" buttonText="Add Team" onClick={addTeamForm.open} />
                    <AddModal
                        opened={addTeamForm.opened}
                        onClose={addTeamForm.close}
                        title="Add Team to School"
                        onSubmit={addTeamForm.handleSubmit}
                        form={addTeamForm.form}
                        fields={[
                            {
                                type: "text",
                                name: "name",
                                autofocus: true,
                                placeholder: "Enter the team's name",
                                required: true,
                                label: "Name"
                            },
                            {
                                type: "select",
                                name: "type",
                                required: true,
                                label: "Type",
                                options: addTeamForm.typeOptions,
                                searchable: false
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
                                options: addTeamForm.caseOptions
                            }
                        ]}
                    />
                    <br />
                    <br />
                </>
            )}
            <TeamFilters
                statusValue={currentStatus}
                onStatusChange={setStatus}
                activeTeams={activeTeams}
                inactiveTeams={inactiveTeams}
                typeVlaue={type}
                onTypeChange={setType}
                disabled={allTeams.length === 0}
            />
            <TeamList teams={getFilteredTeams()} />
        </>
    )
}