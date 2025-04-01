import List from "../../../common/components/List";

export default function SingleStudentView({ selectedStudent }) {
  const detailItems = [
    `Status: ${selectedStudent.is_active ? "Active" : "Inactive"}`,
  ];

  return (
    <>
      <h1>{selectedStudent.name}</h1>
      <List items={detailItems} />
    </>
  );
}
