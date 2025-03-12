import React, { useEffect, useState } from 'react';
import IconButton from '../components/buttons/IconButton';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useSession } from '../context/SessionContext';

export default function SchoolAnalysis () {
    const { schoolId } = useParams();
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState("");

    const { userId } = useSession();

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                const { data: schoolData, error: schoolError } = await supabase
                    .from("schools")
                    .select("*")
                    .eq("id", schoolId)
                    .single();

                if (schoolError) {
                    throw schoolError;
                }

                if (schoolData) {
                    setSchool(schoolData);

                    const { data: roleData, error: roleError } = await supabase
                        .from("users_schools")
                        .select("role")
                        .eq("school_id", schoolId)
                        .eq("user_id", userId)
                        .single();
                    
                    if (roleError) {
                        throw roleError;
                    }

                    if (roleData) {
                        setRole(roleData.role);
                    }
                } else {
                    setError("School not found.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSchool();
    }, []);

    const isAdmin = role === ("Primary") || role === ("Admin");
    const isPrimaryAdmin = role === ("Primary");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>error: {error}</p>;

    document.title = `Analysis - ${
        school.short_name ? school.short_name : school.name
      } - MockMetrics`;

    return (
        <div>
            <IconButton onClickLink={`/schools/${schoolId}`} text={school.short_name ? school.short_name : school.name} icon="back" />
            <h1>Ballot Analysis Dashboard - {school.short_name ? school.short_name : school.name}</h1>
            {isAdmin && <h2>Admin View</h2>}
        </div>
    )
}