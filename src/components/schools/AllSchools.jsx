import React from "react";
import SchoolList from "./SchoolList";

export default function AllSchools({ primaryAdminSchools, adminSchools, viewerSchools }) {
    return (
        <>
            <h1>Schools</h1>
            {primaryAdminSchools.length > 0 && (
                <>
                <h2>Primary Admin Schools</h2>
                <SchoolList schools={primaryAdminSchools} />
                </>
            )}
            {adminSchools.length > 0 && (
                <>
                    <h2>Admin Schools</h2>
                    <SchoolList schools={adminSchools} />
                </>
            )}
            {viewerSchools.length > 0 && (
                <>
                    <h2>Viewer Schools</h2>
                    <SchoolList schools={viewerSchools} />
                </>
            )}
        </>
    )
}