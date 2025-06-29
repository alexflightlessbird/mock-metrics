// Dependency imports
import { useSearchParams } from "react-router-dom";

// Router imports
import SingleCaseRouter from "./SingleCaseRouter";

// Component imports
import AllCasesView from "../views/AllCasesView";
import NotFound from "../../../common/components/NotFound";

// Hooks imports
import { useSelectedItem } from "../../../common/hooks/useSelectedItem";

export default function CasesRouter({ allCases }) {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get("caseId");

  const selectedCase = useSelectedItem({
    items: allCases,
    id: caseId,
  });


  if (!caseId)
    return <AllCasesView allCases={allCases} />;
  if (caseId && !selectedCase) return <NotFound type="case" />;
  if (selectedCase) return <SingleCaseRouter selectedCase={selectedCase} />;
}
