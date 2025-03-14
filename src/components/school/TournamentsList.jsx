import React, { useState, useEffect } from "react";
import Dialog from "../common/dialogs/Dialog";
import { supabase } from "../../services/supabaseClient";
import ListComponent from "../common/lists/ListComponent";
import OpenModalButton from "../common/buttons/OpenModalButton";
import ListWithLoader from "../common/lists/ListWithLoader";

export default function TournamentsList({
  tournaments,
  schoolId,
  isPrimaryAdmin,
  cases,
  teams,
  loading,
  error
}) {
  const [activeTournaments, setActiveTournaments] = useState([]);
  const [inactiveTournaments, setInactiveTournaments] = useState([]);

  useEffect(() => {
    setActiveTournaments(tournaments ? tournaments.filter((t) => t.is_active) : []);
    setInactiveTournaments(tournaments ? tournaments.filter((t) => !t.is_active) : []);
  }, [tournaments]);

  const handleAddTournamentSubmit = async (values) => {
    const { name, year, type, area, caseId, teamIds } = values;

    try {
      const { data, error } = await supabase
        .from("tournaments")
        .insert([
          {
            name,
            year,
            type,
            area,
            case_id: caseId,
            school_id: schoolId,
            is_active: true,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newTournament = data[0];

        if (teamIds && teamIds.length > 0) {
          await supabase.from("teams_tournaments").insert(
            teamIds.map((teamId) => ({
              team_id: teamId,
              tournament_id: newTournament.id,
            }))
          );
        }

        setActiveTournaments((prev) => [...prev, newTournament]);
      }
    } catch (error) {
      console.error("Error adding tournament:", error);
      window.alert("Something went wrong. Please try again.");
    }
  };

  const casesValue = cases ? cases.filter((c) => c.is_active)[0]?.id : "";
  const casesOptions = cases ? cases
    .filter((c) => c.is_active)
    .map((c) => ({ label: c.name, value: c.id })) : {};

  return (
    <div>
      <h2>Tournaments</h2>
      {isPrimaryAdmin && (
        <>
          <OpenModalButton
            type="add"
            dialogClass="add-tournament-dialog"
            text="Add Tournament"
          />
          <Dialog
            className="add-tournament-dialog"
            legendText="Add Tournament"
            handleSubmit={handleAddTournamentSubmit}
            questions={[
              { id: "name", label: "Name", type: "text", required: true },
              {
                id: "year",
                label: "Year",
                type: "number",
                required: true,
                maxLength: 4,
                max: new Date().getFullYear(),
                min: 2000,
                value: new Date().getFullYear(),
              },
              {
                type: "radio",
                label: "Type",
                id: "type",
                options: [
                  { label: "Pre-Stack", value: "Pre-Stack" },
                  { label: "Post-Stack", value: "Post-Stack" },
                ],
                required: true,
              },
              {
                type: "select",
                id: "area",
                label: "Competition Area",
                value: "Invitational",
                optionsGrouped: [
                  {
                    options: [
                      {
                        label: "Invitational",
                        value: "Invitational",
                      },
                      {
                        label: "Regionals",
                        value: "Regionals",
                      },
                      {
                        label: "ORCS",
                        value: "ORCS",
                      },
                      {
                        label: "Nationals",
                        value: "Nationals",
                      },
                      {
                        label: "Rookie Rumble",
                        value: "Rookie Rumble",
                      },
                      {
                        label: "OLT",
                        value: "OLT",
                      },
                      {
                        label: "Other",
                        value: "Other",
                      },
                    ],
                  },
                ],
              },
              {
                type: "select",
                label: "Associated Case",
                id: "caseId",
                value: casesValue,
                options: [
                  casesOptions,
                ],
                required: true,
              },
              ...(teams && teams.length > 0
                ? [
                    {
                      type: "multi-select",
                      label: "Assign Teams to Tournament (Optional)",
                      description: "Multiple can be selected using Ctrl/Cmd",
                      id: "teamIds",
                      options: teams.map((t) => ({
                        label: t.name,
                        value: t.id,
                      })),
                    },
                  ]
                : []),
            ]}
          />
        </>
      )}
      <ListWithLoader
        items={activeTournaments}
        title="Active Tournaments"
        emptyMessage="No active tournaments."
        linkPath="/tournaments"
        loading={loading}
        error={error}
      />
      <ListWithLoader
        items={inactiveTournaments}
        title="Inactive Tournaments"
        emptyMessage="No inactive tournaments."
        linkPath="/tournaments"
        loading={loading}
        error={error}
      />
    </div>
  );
}
