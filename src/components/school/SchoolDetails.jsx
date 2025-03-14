import React from 'react';

export default function SchoolDetails({ shortName, role }) {
    return (
        <ul>
            <li>Short Name: {shortName}</li>
            <li>Your Role: {role}{role === "Primary" ? " Admin" : ""}</li>
        </ul>
    )
}