// Component imports
import CardList from "../../../../common/components/CardList";

export default function WitnessList({ witnesses }) {

  const mappedWitnesses = [];

  witnesses.map((w) => {
    let color;
    switch (w.type.toLowerCase()) {
      case "character": color = "lavender"; break;
      case "expert": color = "errorRed"; break;
      case "party rep": color = "emerald"; break;
      case "police/investigator": color = "sunshine"; break;
      case "other": color = "coral"; break;
      default: color = "lightGray"; break;
    }

    mappedWitnesses.push(
      {
        title: w.name,
        badges: [
          {
            text: w.side,
            color: (w.side.toLowerCase() === "plaintiff" || w.side.toLowerCase() === "prosecution") ? "darkBlue" : w.side.toLowerCase() === "defense" ? "primaryBlue" : "lightGray"
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