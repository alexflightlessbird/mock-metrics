// Router imports
import SchoolRouter from "./routers/SchoolRouter";

// Component imports
import SchoolBreadcrumb from "./components/breadcrumb/SchoolBreadcrumb";
import Loading from "../../common/components/Loading";

// Hooks imports
import { useSchools } from "../../hooks/api/useSchools";
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
