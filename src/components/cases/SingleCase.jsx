import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../../common/components/List";
import WitnessList from "./WitnessList";
import { Tabs } from "@mantine/core";

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
      if (error) console.error("Error fetching witnesses:", error);
      else setAllWitnesses(data);
    };

    fetchWitnesses();
  }, [selectedCase.id]);

  const detailItems = [
    `Year: ${selectedCase.year}`,
    `Status: ${selectedCase.is_active ? "Active" : "Inactive"}`,
    `Type: ${selectedCase.type}`,
    `Area: ${selectedCase.area}`,
  ];

  return (
    <>
      <h1>{selectedCase.name}</h1>
      <List items={detailItems} />
      <br />

      <h2>Witnesses</h2>
      <Tabs defaultValue="plaintiff">
        <Tabs.List>
          <Tabs.Tab value="plaintiff">Plaintiff</Tabs.Tab>
          <Tabs.Tab value="defense">Defense</Tabs.Tab>
          <Tabs.Tab value="swing">Swing</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="plaintiff">
          <h3>Plaintiff Witnesses</h3>
          <WitnessList witnesses={pWitnesses} />
        </Tabs.Panel>

        <Tabs.Panel value="defense">
          <h3>Defense Witnesses</h3>
          <WitnessList witnesses={dWitnesses} />
        </Tabs.Panel>

        <Tabs.Panel value="swing">
          <h3>Swing Witnesses</h3>
          <WitnessList witnesses={sWitnesses} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}