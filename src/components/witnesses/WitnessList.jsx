import React from "react";
import { Link } from "react-router-dom";
import List from "../../common/components/List";

export default function witnessList({ witnesses }) {
  const mappedWitnesses = [];
  witnesses.map((w) =>
    mappedWitnesses.push(<Link to={`/witnesses?id=${w.id}`}>{w.name}</Link>)
  );
  if (mappedWitnesses.length == 0) mappedWitnesses.push("None");
  return <List items={mappedWitnesses} />;
}
