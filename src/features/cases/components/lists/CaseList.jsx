// Dependency imports
import { Link } from "react-router-dom";
import { useMantineTheme, Group } from "@mantine/core";

// Component imports
import List from "../../../../common/components/List";
import CardList from "../../../../common/components/CardList";

export default function CaseList({ cases }) {
  const theme = useMantineTheme();

  const mappedCases = [];

  cases.map((c) => {
    const textList = [`${c.year}`, `${c.area}`];

    mappedCases.push(
      {
        title: <Link to={`/cases?caseId=${c.id}`}>{c.name}</Link>,
        badge: {
          text: c.type,
          color: theme.colors.darkBlue[0]
        },
        text: <Group maw="100%"><List withPadding={false} items={textList} listStyleType="none" /></Group>
      }
    )
  })

  return (
    <>
      <CardList items={mappedCases} />
    </>
  );
}
