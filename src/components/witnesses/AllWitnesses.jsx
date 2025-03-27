import React from "react";
import WitnessList from "./WitnessList";

export default function AllWitnesses({ activeWitnesses, inactiveWitnesses }) {
  return (
    <>
      <h1>Witnesses</h1>
      <h2>Active Witnesses</h2>
      <WitnessList witnesses={activeWitnesses} />
      <h2>Inactive Witnesses</h2>
      <WitnessList witnesses={inactiveWitnesses} />
    </>
  );
}
