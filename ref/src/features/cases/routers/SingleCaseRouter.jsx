// Component imports
import SingleCaseView from "../views/SingleCaseView";
import Loading from "../../../common/components/Loading";

// Hooks imports
import { useCaseWitnesses } from "../../../hooks/api/useCases";

export default function SingleCaseRouter({ selectedCase }) {
  const { data: allCaseWitnesses = [], isPending } = useCaseWitnesses(
    selectedCase.id
  );

  if (isPending) return <Loading />;

    return (
      <SingleCaseView
        selectedCase={selectedCase}
        allCaseWitnesses={allCaseWitnesses}
      />
    );
}
