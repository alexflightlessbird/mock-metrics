import React from "react";
import { useForm, hasLength } from "@mantine/form";
import { modals } from "@mantine/modals";
import { supabase } from "../../services/supabaseClient";
import { ROLES } from "../../utils/constants";
import { Flex, TextInput } from "@mantine/core";
import { EditIcon } from "../common/ActionIcons";
import IconButton from "../common/buttons/NewIconButton";
import List from "../common/List";
import SchoolTabs from "./SchoolTabs";

export default function SingleSchoolDetails({ selectedSchool, allUsers, allStudents, allTeams, allTournaments, triggerReload, triggerReloadSingle, currentTab, setCurrentTab }) {
    const detailItems = [
        `Short Name: ${selectedSchool.schools.short_name}`,
        selectedSchool.role === ROLES.PRIMARY ? `Premium Status: ${selectedSchool.schools.is_premium ? "Active" : "Inactive"}` : "",
        `Your Role: ${selectedSchool.role === ROLES.PRIMARY ? "Primary Admin" : selectedSchool.role}`
    ];

    const editSchoolForm = useForm({
        mode: "uncontrolled",
        initialValues: {
            shortName: selectedSchool.schools.short_name || ""
        },
        validate: {
            shortName: hasLength({ min: 2, max: 10 }, "Short names must be 2-10 characters long")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

    const handleEditSchoolSubmit = async (values) => {
        if (values.shortName === selectedSchool.schools.short_name) {
            modals.closeAll();
            return;
        }
        try {
            const { error } = await supabase
                .from("schools")
                .update({ short_name: values.shortName })
                .eq("id", selectedSchool.schools.id);
            if (error) throw error;
            modals.closeAll();
            triggerReload();
        } catch (error) {
            console.error("Error updating school short name:", error);
        }
    }

    const editSchoolModal = () => {
        modals.open({
            title: "Edit School Details",
            children: (
                <>
                    <form onSubmit={editSchoolForm.onSubmit(handleEditSchoolSubmit)}>
                        <TextInput
                            label="Short Name"
                            withAsterisk
                            key={editSchoolForm.key("shortName")}
                            placeholder="Enter the school's short name"
                            {...editSchoolForm.getInputProps("shortName")}
                        />
                        <br />
                        <IconButton icon="save" type="submit" buttonText="Submit" />
                    </form>
                </>
            )
        })
    }

    const schoolTabsProps = {
        role: selectedSchool.role,
        allUsers,
        allTeams,
        allStudents,
        allTournaments,
        triggerReload: triggerReloadSingle,
        isPremium: selectedSchool.schools.is_premium,
        schoolId: selectedSchool.schools.id,
        schoolName: selectedSchool.schools.name,
        currentTab,
        setCurrentTab
    }

    return (
        <>
            <h1>{selectedSchool.schools.name}</h1>
            <Flex style={{ alignItems: "center", gap: "7px" }}>
                <h2>School Details</h2>
                {selectedSchool.role === ROLES.PRIMARY && <EditIcon onClick={editSchoolModal} />}
            </Flex>
            <List items={detailItems} />
            <br />

            <SchoolTabs {...schoolTabsProps} />
        </>
    )
}