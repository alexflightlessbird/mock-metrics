import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../services/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers";
import { useSession } from "../hooks/auth/useSession";
import SingleSchool from "../components/schools/SingleSchool";
import AllSchools from "../components/schools/AllSchools";
import SchoolBreadcrumb from "../components/schools/SchoolBreadcrumb";

export default function Schools() {
    const [allSchools, setAllSchools] = useState([]);
    const [searchParams] = useSearchParams();
    const { userId } = useSession();
    const id = searchParams.get("id");
    const [reload, setReload] = useState(false);

    const [primaryAdminSchools, adminSchools, viewerSchools] = useMemo(() => {
        const primary = allSchools.filter((s) => s.role === "Primary");
        const admin = allSchools.filter((s) => s.role === "Admin");
        const viewer = allSchools.filter((s) => s.role === "Viewer");
        return [primary, admin, viewer];
    }, [allSchools]);

    const selectedSchool = useMemo(() => {
        if (!id) return null;
        const found = allSchools.find((s) => s.school_id === parseInt(id));
        return found ? {...found} : null;
    }, [id, allSchools]);

    const triggerReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        const fetchSchools = async () => {
            const { data, error } = await supabase
                .from("users_schools")
                .select("*, schools(*)")
                .eq("user_id", userId)
                .order("schools(name)");
            if (error) console.error("Error fetching schools:", error);
            else setAllSchools(data);
        }
        fetchSchools();
    }, [reload, userId]);

    useEffect(() => {
        const currentTitle = selectedSchool?.schools?.name || "Schools";
        setDocumentTitle({ title: currentTitle });
    }, [selectedSchool?.schools?.name]);

    return (
        <>
            <SchoolBreadcrumb selectedSchool={selectedSchool} />
            {selectedSchool ? (
                <SingleSchool
                    key={selectedSchool.school_id}
                    selectedSchool={selectedSchool}
                    triggerReload={triggerReload}
                />
            ) : (
                <AllSchools
                    key="all-schools"
                    primaryAdminSchools={primaryAdminSchools}
                    adminSchools={adminSchools}
                    viewerSchools={viewerSchools}
                />
            )}
        </>
    )
}