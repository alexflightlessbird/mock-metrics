import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/helpers/documentTitle";

export default function Schools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");
      if (error) {
        console.error("Error fetching schools:", error);
      } else {
        setSchools(data);
      }
    };
    fetchSchools();
  }, []);

  setDocumentTitle("Schools");

  return (
    <div>
      <h1>Schools</h1>
      <ul>
        {schools.map((s) => (
          <li key={s.id}>
            <Link to={`/schools/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
