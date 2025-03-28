import CaseRouter from "./routers/CaseRouter";
import { useCases } from "../../hooks/api/useCases";
import CaseBreadcrumb from "./components/breadcrumb/CaseBreadcrumb";

export default function Cases() {
    const { data: allCases = [], isPending } = useCases();

    if (isPending) return <div>Loading cases...</div>;

    return (
        <>
            <CaseBreadcrumb />
            <CaseRouter allCases={allCases} />
        </>
    )
}