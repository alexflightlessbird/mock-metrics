export default function SingleCaseView({ selectedCase, allCaseWitnesses }) {
    if (!selectedCase || selectedCase === "Not found") {
        return <div>No case found for that ID.</div>
    }
    console.log(selectedCase);
    console.log(allCaseWitnesses);
    return <div>Single Case View</div>
}