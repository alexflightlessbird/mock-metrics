// Dependency imports
import { Link } from "react-router-dom";
import { useMantineTheme } from "@mantine/core";

// Component imports
import CardList from "../../../../common/components/CardList";

export default function WitnessList({ witnesses }) {
  const theme = useMantineTheme();

  const mappedWitnesses = [];

  witnesses.map((w) => {
    let color;
    switch (w.type.toLowerCase()) {
      case "character": color = theme.colors.darkBlue[0]; break;
      case "expert": color = "red"; break;
      case "party rep": color = "green"; break;
      case "police/investigator": color = "purple"; break;
      case "other": color = theme.colors.lightGray[0]; break;
      default: color = theme.colors.primaryBlue[0]; break;
    }

    mappedWitnesses.push(
      {
        title: w.name,
        badges: [
          {
            text: w.side,
            color: (w.side.toLowerCase() === "plaintiff" || w.side.toLowerCase() === "prosecution") ? theme.colors.darkBlue[0] : w.side.toLowerCase() === "defense" ? theme.colors.primaryBlue[0] : theme.colors.lightGray[0]
          },
          {
            text: w.type,
            color: color
          }
        ],
      }
    )
  })

  return (
    <CardList items={mappedWitnesses} />
  );
}