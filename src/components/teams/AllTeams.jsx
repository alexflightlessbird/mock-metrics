import TeamList from "./TeamList";

export default function AllTeams({ activeTeams, inactiveTeams }) {
  return (
    <>
      <h1>Teams</h1>
      <h2>Active Teams</h2>
      <TeamList teams={activeTeams} />
      <h2>Inactive Teams</h2>
      <TeamList teams={inactiveTeams} />
    </>
  );
}
