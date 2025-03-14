import React from "react";
import { NavLink } from "react-router-dom";

export default function NavLinks({ session }) {
    return (
        <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/cases">Cases</NavLink>
            {session && <NavLink to="/schools">Schools</NavLink>}
            {session && <NavLink to="/profile">Profile</NavLink>}
        </>
    )
}