import { useActiveFilters } from "../../../../common/hooks/useActiveFilters";
import TournamentList from "../lists/SingleSchool/TournamentList";
import TournamentFilters from "../filters/TournamentFilters";
import IconButton from "../../../../common/components/IconButton";
import FormModal from "../../../../common/components/FormModal";
import { useTournamentFilters } from "../../hooks/useSingleSchoolTabs";

export default function TournamentsTabContent({
    allTournaments,
    hasAddPermissions,
    addTournamentForm
}) {
    const { active: activeTournaments, inactive: inactiveTournaments } = useActiveFilters(allTournaments);
    const { status, type, area, setStatus, setType, setArea } = useTournamentFilters();

    const currentStatus = (status === "inactive" && inactiveTournaments.length === 0) || (status === "active" && activeTournaments.length === 0) ? "all" : status;

    function getFilteredTournaments () {
        let filtered = [];
        switch (status) {
            case "active": filtered = activeTournaments; break;
            case "inactive": filtered = inactiveTournaments; break;
            case "all": filtered = [...activeTournaments, ...inactiveTournaments]; break;
            default: filtered = activeTournaments; break;
        }

        if (type !== "all") {
            filtered = filtered.filter(t => t.type.toLowerCase() === type);
        }

        if (area !== "all") {
            filtered = filtered.filter(t => t.area.toLowerCase() === area);
        }

        return filtered;
    }

    const modalProps = {
        opened: addTournamentForm.opened,
        onClose: addTournamentForm.close,
        title: "Add Tournament to School",
        onSubmit: addTournamentForm.handleSubmit,
        form: addTournamentForm.form,
        fields: [
            {
                type: "text",
                name: "name",
                autofocus: true,
                placeholder: "Enter the tournament's name",
                required: true,
                label: "Name"
            },
            {
                type: "select",
                name: "type",
                required: true,
                label: "Type",
                options: addTournamentForm.typeOptions,
                searchable: false
            },
            {
                type: "select",
                name: "area",
                required: true,
                label: "Area",
                options: addTournamentForm.areaOptions
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
                options: addTournamentForm.caseOptions.filter((c) => c.value !== "null")
            }
        ]
    }

    return (
        <>
            <br />
            {hasAddPermissions && (
                <>
                    <IconButton icon="add" buttonText="AddTournament" onClick={addTournamentForm.open} />
                    <FormModal {...modalProps} />
                    <br />
                    <br />
                </>
            )}
            <TournamentFilters
                statusValue={currentStatus}
                onStatusChange={setStatus}
                activeTournaments={activeTournaments}
                inactiveTournaments={inactiveTournaments}
                typeValue={type}
                onTypeChange={setType}
                areaValue={area}
                onAreaChange={setArea}
                disabled={allTournaments.length === 0}
            />
            <TournamentList tournaments={getFilteredTournaments()} />
        </>
    )
}