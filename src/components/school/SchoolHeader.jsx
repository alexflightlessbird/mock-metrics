import React from "react";
import IconButton from "../common/buttons/IconButton";
import OpenModalButton from "../common/buttons/OpenModalButton";
import Dialog from "../common/dialogs/Dialog";

export default function SchoolHeader ({ school, isPrimaryAdmin, shortName, handleEditSchoolSubmit }) {
    return (
        <div>
            <IconButton onClickLink="/schools" text="All Schools" icon="back" />
            <h1>{school.name}</h1>
            {isPrimaryAdmin && (
                <>
                    <OpenModalButton 
                        type="edit" 
                        text="Edit School" 
                        dialogClass="edit-school-dialog" 
                    />
                    <Dialog 
                        className="edit-school-dialog" 
                        legendText="Edit School" 
                        handleSubmit={handleEditSchoolSubmit} 
                        questions={[
                            { 
                                type: "text", 
                                id: "short-name", 
                                label: "Short Name", 
                                value: shortName, 
                                required: true
                            },
                        ]} 
                    />
                </>
            )}
            <IconButton
                icon="forward"
                onClickLink={`/schools/${school.id}/analysis`}
                text="Ballot Analysis"
            />
        </div>
    )
}