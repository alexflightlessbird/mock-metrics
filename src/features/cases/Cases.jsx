import CaseRouter from "./routers/CaseRouter";
import { useCases } from "../../hooks/api/useCases";
import CaseBreadcrumb from "./components/breadcrumb/CaseBreadcrumb";
import Loading from "../../common/components/Loading";

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
