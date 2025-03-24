import React from "react";
import SchoolList from "./SchoolList";

export default function AllSchools({ primaryAdminSchools, adminSchools, viewerSchools }) {
    return (
        <>
            <h1>Schools</h1>
            <h2>Primary Admin Schools</h2>
            <SchoolList schools={primaryAdminSchools} />
            <h2>Admin Schools</h2>
            <SchoolList schools={adminSchools} />
            <h2>Viewer Schools</h2>
            <SchoolList schools={viewerSchools} />
        </>
    )
}