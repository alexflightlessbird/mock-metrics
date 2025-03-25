import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../services/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers";
import SingleTeam from "../components/teams/SingleTeam";
import AllTeams from "../components/teams/AllTeams";
import TeamBreadcrumb from "../components/teams/TeamBreadcrumb";

export default function Teams() {
  const [allTeams, setAllTeams] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [activeTeams, inactiveTeams] = useMemo(() => {
    const active = allTeams.filter((c) => c.is_active);
    const inactive = allTeams.filter((c) => !c.is_active);
    return [active, inactive];
  }, [allTeams]);

  const selectedTeam = useMemo(() => {
    if (!id) return null;
    const found = allTeams.find((t) => t.id === parseInt(id));
    return found ? { ...found } : null;
  }, [id, allTeams]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*, schools(*)");
      if (error) console.error("Error fetching teams:", error);
      else setAllTeams(data);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const currentTitle = selectedTeam?.name || "Teams";
    setDocumentTitle({ title: currentTitle });
  }, [selectedTeam?.name]);

  return (
    <>
      <TeamBreadcrumb selectedTeam={selectedTeam} />
      {selectedTeam ? (
        <SingleTeam selectedTeam={selectedTeam} />
      ) : (
        <AllTeams activeTeams={activeTeams} inactiveTeams={inactiveTeams} />
      )}
    </>
  );
}
