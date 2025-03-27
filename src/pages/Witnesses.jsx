import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../services/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers";
import SingleWitness from "../components/witnesses/SingleWitness";
import AllWitnesses from "../components/witnesses/AllWitnesses";
import WitnessBreadcrumb from "../components/witnesses/WitnessBreadcrumb";

export default function Witnesses() {
  const [allWitnesses, setAllWitnesses] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [activeWitnesses, inactiveWitnesses] = useMemo(() => {
    const active = allWitnesses.filter((w) => w.cases.is_active);
    const inactive = allWitnesses.filter((w) => !w.cases.is_active);
    return [active, inactive];
  }, [allWitnesses]);

  const selectedWitness = useMemo(() => {
    if (!id) return null;
    const found = allWitnesses.find((w) => w.id === parseInt(id));
    return found ? { ...found } : null;
  }, [id, allWitnesses]);

  useEffect(() => {
    const fetchWitnesses = async () => {
      const { data, error } = await supabase
        .from("witnesses")
        .select("*, cases(*)")
        .order("name");
      if (error) console.error("Error fetching witnesses:", error);
      else setAllWitnesses(data);
    };
    fetchWitnesses();
  }, []);

  useEffect(() => {
    const currentTitle = selectedWitness?.name || "Witnesses";
    setDocumentTitle({ title: currentTitle });
  }, [selectedWitness?.name]);

  return (
    <>
      <WitnessBreadcrumb selectedWitness={selectedWitness} />
      {selectedWitness ? (
        <SingleWitness selectedWitness={selectedWitness} />
      ) : (
        <AllWitnesses
          activeWitnesses={activeWitnesses}
          inactiveWitnesses={inactiveWitnesses}
        />
      )}
    </>
  );
}
