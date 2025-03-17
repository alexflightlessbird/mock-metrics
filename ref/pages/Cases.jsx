import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers/documentTitle";

export default function Cases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("year", { ascending: false });
      if (error) {
        console.error("Error fetching cases:", error);
      } else {
        setCases(data);
      }
    };
    fetchCases();
  }, []);

  setDocumentTitle("Cases");

  return (
    <div>
      <h1>Cases</h1>
      <ul>
        {cases.map((c) => (
          <li key={c.id}>
            <Link to={`/cases/${c.id}`}>{c.name}</Link>
            {c.is_active ? " - Current Case" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
