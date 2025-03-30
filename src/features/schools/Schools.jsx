import SchoolRouter from "./routers/SchoolRouter";
import { useSchools } from "../../hooks/api/useSchools";
import SchoolBreadcrumb from "./components/breadcrumb/SchoolBreadcrumb";
import Loading from "../../common/components/Loading";
import { useSession } from "../../common/hooks/auth/useSession";

export default function Schools() {
  const { userId } = useSession();

  const { data: allSchools = [], isPending } = useSchools(userId);

  if (isPending) return <Loading />;

  return (
    <>
      <SchoolBreadcrumb />
      <SchoolRouter allSchools={allSchools} />
    </>
  );
}
