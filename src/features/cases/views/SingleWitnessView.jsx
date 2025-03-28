import List from "../../../common/components/List";

export default function SingleWitnessView({ selectedWitness }) {
    if (!selectedWitness || selectedWitness === "Not found") {
        return <div>No witness found for that ID.</div>
    }

    const detailItems = [
        `Side: ${selectedWitness.side}`,
        `Type: ${selectedWitness.type}`
    ];

    return (
        <>
            <h1>{selectedWitness.name}</h1>
            <List items={detailItems} />
        </>
    )
}