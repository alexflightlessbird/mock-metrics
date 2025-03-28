import React from "react";
import List from "../../common/components/List";
import { Link } from "react-router-dom";
import { Text } from "@mantine/core";

export default function SingleWitness({ selectedWitness }) {
  const caseItem = (
    <Link to={`/cases?id=${selectedWitness.cases.id}`}>
      {selectedWitness.cases.name}
    </Link>
  );
  const detailItems = [
    `Side: ${selectedWitness.side}`,
    `Type: ${selectedWitness.type}`,
    <Text>Associated Case: {caseItem}</Text>,
  ];

  return (
    <>
      <h1>{selectedWitness.name}</h1>
      <h2>Witness Details</h2>
      <List items={detailItems} />
    </>
  );
}
