import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import IconButton from "../components/buttons/IconButton";
import icons from "../utils/icons.json";

export default function Case() {
  const { caseId } = useParams();
  const [caseVal, setCaseVal] = useState(null);
  const [witnesses, setWitnesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const { data: caseData, error: caseError } = await supabase
          .from("cases")
          .select("*")
          .eq("id", caseId)
          .single();

        if (caseError) {
          throw caseError;
        }

        if (caseData) {
          setCaseVal(caseData);

          const { data: witnessData } = await supabase
            .from("witnesses")
            .select("*")
            .eq("case_id", caseId)
            .order("name");

          if (witnessData && witnessData.length > 0) {
            setWitnesses(witnessData);
          }
        } else {
          setError("Case not found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${caseVal.name} - MockMetrics`;

  return (
    <div>
      <IconButton onClickLink="/cases" text="All Cases" icon="back" />
      <h1>{caseVal.name}</h1>
      <ul>
        <li>Year: {caseVal.year}</li>
        <li>Type: {caseVal.type}</li>
        <li>Current Case: {caseVal.is_active ? icons["check"] : icons["x"]}</li>
      </ul>
      <h2>Witnesses</h2>
      <h3>Plaintiff Side-Locked</h3>
      <ul>
        {witnesses
          .filter((w) => w.side === "Plaintiff")
          .map((w) => (
            <li key={w.id}>
              <Link to={`/witness/${w.id}`}>{w.name}</Link>
            </li>
          ))}
      </ul>
      <h3>Defense Side-Locked</h3>
      <ul>
        {witnesses
          .filter((w) => w.side === "Defense")
          .map((w) => (
            <li key={w.id}>
              <Link to={`/witness/${w.id}`}>{w.name}</Link>
            </li>
          ))}
      </ul>
      <h3>Swing</h3>
      <ul>
        {witnesses
          .filter((w) => w.side === "Swing")
          .map((w) => (
            <li key={w.id}>
              <Link to={`/witness/${w.id}`}>{w.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
