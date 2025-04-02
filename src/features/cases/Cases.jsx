// Router imports
import CaseRouter from "./routers/CaseRouter";

// Component imports
import CaseBreadcrumb from "./components/breadcrumb/CaseBreadcrumb";
import Loading from "../../common/components/Loading";

// Hooks imports
import { useCases } from "../../hooks/api/useCases";

export default function Cases() {
  const { data: allCases = [], isPending } = useCases();

  if (isPending) return <Loading />;

  return (
    <>
      <CaseBreadcrumb />
      <CaseRouter allCases={allCases} />
    </>
  );
}
