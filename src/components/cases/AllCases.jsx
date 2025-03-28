import CaseList from "./CaseList";

export default function AllCases({ activeCases, inactiveCases }) {
  return (
    <>
      <h1>Cases</h1>
      <h2>Active Cases</h2>
      <CaseList cases={activeCases} />
      <h2>Inactive Cases</h2>
      <CaseList cases={inactiveCases} />
    </>
  );
}
