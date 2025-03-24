import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import TeamList from "./TeamList";
import StudentList from "./StudentList";

export default function SingleSchool({ selectedSchool }) {
    const [allTeams, setAllTeams] = useState([]);    
    const [allStudents, setAllStudents] = useState([]);

    const [activeTeams, inactiveTeams] = useMemo(() => {
        const active = allTeams.filter((t) => t.is_active);
        const inactive = allTeams.filter((t) => !t.is_active);
        return [active, inactive];
    }, [allTeams]);

    const [activeStudents, inactiveStudents] = useMemo(() => {
        const active = allStudents.filter((s) => s.is_active);
        const inactive = allStudents.filter((s) => !s.is_active);
        return [active, inactive];
    }, [allStudents]);

    useEffect(() => {
        const fetchTeams = async () => {
            const { data, error } = await supabase
                .from("teams")
                .select("*")
                .eq("school_id", selectedSchool.schools.id)
                .order("name");
            if (error) console.error("Error fetching schools:", error);
            else setAllTeams(data);
        }

        const fetchStudents = async () => {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("school_id", selectedSchool.schools.id)
                .order("name");
            if (error) console.error("Error fetching students:", error);
            else setAllStudents(data);
        }
        fetchTeams();
        fetchStudents();
    }, []);

    const detailItems = [
        `Short Name: ${selectedSchool.schools.short_name}`,
        `Premium Status: ${selectedSchool.schools.is_premium ? "Active" : "Inactive"}`,
        `Your Role: ${selectedSchool.role}`
    ];

    return (
        <>
            <h1>{selectedSchool.schools.name}</h1>
            <h2>School Details</h2>
            <List items={detailItems} />
            <h2>Teams</h2>
            <h3>Active Teams</h3>
            <TeamList teams={activeTeams} />
            <h3>Inactive Teams</h3>
            <TeamList teams={inactiveTeams} />
            <h2>Students</h2>
            <h3>Active Students</h3>
            <StudentList students={activeStudents} />
            <h3>Inactive Students</h3>
            <StudentList students={inactiveStudents} />
        </>
    )
}