import List from "../../../common/components/List";

export default function SingleTeamView({ selectedTeam }) {
  const detailItems = [
    `Type: ${selectedTeam.type}`,
    `Status: ${selectedTeam.is_active ? "Active" : "Inactive"}`
  ];

  return (
    <>
      <h1>{selectedTeam.name}</h1>
      <List items={detailItems} />
    </>
  );
}
