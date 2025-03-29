import List from "../../../common/components/List";
import NotFound from "../../../common/components/NotFound";

export default function SingleWitnessView({ selectedWitness }) {
  if (!selectedWitness || selectedWitness === "Not found") {
    return <NotFound type="witness" />;
  }

  const detailItems = [
    `Side: ${selectedWitness.side}`,
    `Type: ${selectedWitness.type}`,
  ];

  return (
    <>
      <h1>{selectedWitness.name}</h1>
      <List items={detailItems} />
    </>
  );
}
