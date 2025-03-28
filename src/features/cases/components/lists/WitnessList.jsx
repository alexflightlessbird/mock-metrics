import { Link } from "react-router-dom";
import List from "../../../../common/components/List";

export default function WitnessList({ witnesses }) {
    const mappedWitnesses = [];
    witnesses.map((w) => 
        mappedWitnesses.push(<Link to={`/cases?caseId=${w.case_id}&witnessId=${w.id}`}>{w.name}</Link>)
    );
    if (mappedWitnesses.length == 0) mappedWitnesses.push("None");
    return <List items={mappedWitnesses} />
}