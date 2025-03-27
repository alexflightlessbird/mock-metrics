import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../services/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers";
import SingleCase from "../components/cases/SingleCase";
import AllCases from "../components/cases/AllCases";
import CaseBreadcrumb from "../components/cases/CaseBreadcrumb";

export default function Cases() {
  const [allCases, setAllCases] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [activeCases, inactiveCases] = useMemo(() => {
    const active = allCases.filter((c) => c.is_active);
    const inactive = allCases.filter((c) => !c.is_active);
    return [active, inactive];
  }, [allCases]);

  const selectedCase = useMemo(() => {
    if (!id) return null;
    const found = allCases.find((c) => c.id === parseInt(id));
    return found ? { ...found } : null;
  }, [id, allCases]);

  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("year", { ascending: false });
      if (error) console.error("Error fetching cases:", error);
      else setAllCases(data);
    };
    fetchCases();
  }, []);

  useEffect(() => {
    const currentTitle = selectedCase?.name || "Cases";
    setDocumentTitle({ title: currentTitle });
  }, [selectedCase?.name]);

  return (
    <>
      <CaseBreadcrumb selectedCase={selectedCase} />
      {selectedCase ? (
        <SingleCase selectedCase={selectedCase} />
      ) : (
        <AllCases activeCases={activeCases} inactiveCases={inactiveCases} />
      )}
    </>
  );
}
