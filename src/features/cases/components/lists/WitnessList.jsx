// Dependency imports
import { Link } from "react-router-dom";
import { useMantineTheme } from "@mantine/core";

// Component imports
import CardList from "../../../../common/components/CardList";

export default function WitnessList({ witnesses }) {
  const theme = useMantineTheme();

  const mappedWitnesses = [];

  witnesses.map((w) => {
    mappedWitnesses.push(
      {
        title: w.name,
        badges: [
          {
            text: w.side,
            color: theme.colors.darkBlue[0]
          },
          {
            text: w.type,
            color: theme.colors.primaryBlue[0]
          }
        ],
      }
    )
  })

  return (
    <CardList items={mappedWitnesses} />
  );
}