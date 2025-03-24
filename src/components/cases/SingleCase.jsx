import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import WitnessList from "./WitnessList";

export default function SingleCase({ selectedCase }) {
    const [allWitnesses, setAllWitnesses] = useState([]);

    const [pWitnesses, dWitnesses, sWitnesses] = useMemo(() => {
        const p = allWitnesses.filter((w) => w.side === "Plaintiff");
        const d = allWitnesses.filter((w) => w.side === "Defense");
        const s = allWitnesses.filter((w) => w.side === "Swing");
        return [p, d, s];
    }, [allWitnesses]);

    useEffect(() => {
        const fetchWitnesses = async () => {
            const { data, error } = await supabase
                .from("witnesses")
                .select("*")
                .eq("case_id", selectedCase.id)
                .order("name");
            if (error) console.error("Error fetching witnesses", error);
            else setAllWitnesses(data);
        }
        fetchWitnesses();
    }, []);

    const detailItems = [
        `Year: ${selectedCase.year}`,
        `Status: ${selectedCase.is_active ? "Active" : "Inactive"}`,
        `Type: ${selectedCase.type}`,
        `Area: ${selectedCase.area}`
    ];

    return (
        <>
            <h1>{selectedCase.name}</h1>
            <h2>Case Details</h2>
            <List items={detailItems}/>
            <h2>Associated Witnesses</h2>
            <h3>Plaintiff</h3>
            <WitnessList witnesses={pWitnesses} />
            <h3>Defense</h3>
            <WitnessList witnesses={dWitnesses} />
            <h3>Swing</h3>
            <WitnessList witnesses={sWitnesses} />
        </>
    )
}