import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers";
import { useSession } from "../common/hooks/auth/useSession";
import SingleSchool from "../components/schools/SingleSchool";
import AllSchools from "../components/schools/AllSchools";
import { ROLES } from "../utils/constants";
import { useSchools } from "../hooks/api/useSchools";

export default function Schools() {
  const [searchParams] = useSearchParams();
  const { userId } = useSession();
  const schoolId = searchParams.get("schoolId");
  const { data: allSchools = [], isPending } = useSchools(userId);

  const [primaryAdminSchools, adminSchools, viewerSchools] = useMemo(() => {
    const primary = allSchools.filter((s) => s.role === ROLES.PRIMARY);
    const admin = allSchools.filter((s) => s.role === ROLES.ADMIN);
    const viewer = allSchools.filter((s) => s.role === ROLES.VIEWER);
    return [primary, admin, viewer];
  }, [allSchools]);

  const selectedSchool = useMemo(() => {
    if (!schoolId) return null;
    return allSchools.find((s) => s.schools.id === parseInt(schoolId)) || null;
  }, [schoolId, allSchools]);

  useEffect(() => {
    const currentTitle = selectedSchool?.schools?.name || "Schools";
    setDocumentTitle({ title: currentTitle });
  }, [selectedSchool?.schools?.name]);

  if (isPending) return <div>Loading schools...</div>;

  return (
    <>
      {selectedSchool ? (
        <SingleSchool
          key={selectedSchool.schools.id}
          selectedSchool={selectedSchool}
        />
      ) : (
        <AllSchools
          key="all-schools"
          primaryAdminSchools={primaryAdminSchools}
          adminSchools={adminSchools}
          viewerSchools={viewerSchools}
        />
      )}
    </>
  )
}