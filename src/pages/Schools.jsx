import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

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

  document.title = "Schools - MockMetrics";

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
