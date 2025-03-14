import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers/documentTitle";

export default function Witness() {
  const { witnessId } = useParams();
  const [witness, setWitness] = useState(null);
  const [caseVal, setCaseVal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWitness = async () => {
      try {
        const { data: witnessData, error: witnessError } = await supabase
          .from("witnesses")
          .select("*")
          .eq("id", witnessId)
          .single();

        if (witnessError) {
          throw witnessError;
        }

        if (witnessData) {
          setWitness(witnessData);

          const { data: caseData } = await supabase
            .from("cases")
            .select("*")
            .eq("id", witnessData.case_id)
            .single();

          if (caseData) {
            setCaseVal(caseData);
          }
        } else {
          setError("Witness not found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWitness();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  setDocumentTitle(witness.name);
  
  return (
    <div>
      <h1>{witness.name}</h1>
      <ul>
        <li>
          Associated Case:{" "}
          <Link to={`/cases/${caseVal.id}`}>{caseVal.name}</Link>
        </li>
        <li>Side: {witness.side}</li>
        <li>Type: {witness.type}</li>
      </ul>
    </div>
  );
}
