export default function SingleWitnessView({ selectedWitness }) {
    if (!selectedWitness || selectedWitness === "Not found") {
        return <div>No witness found for that ID.</div>
    }
    console.log(selectedWitness);
    return <div>Single Witness View</div>
}