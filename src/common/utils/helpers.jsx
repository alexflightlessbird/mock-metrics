export function capitalize(str) {
  if (!str) return;
  if (str.toLowerCase() === "orcs") {
    return "ORCS";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitSlash(str) {
  if (!str) return "-";
  const parts = str.split("/");

  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <>
              /
              <wbr />
            </>
          )}
        </span>
      ))}
    </span>
  );
}

export function splitEmail(email) {
  if (!email) return "-";
  const [localPart, domain] = email.split("@");

  return (
    <span>
      {localPart}
      <wbr />@{domain}
    </span>
  );
}

export function emToPx(emValue) {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return emValue * rootFontSize;
}

export function selectedItem({ items, itemIdName = "id", id = null }) {
  if (!id) return null;
  return items.find((item) => item[itemIdName] === id) || null;
}

export function formatSide (side, caseType) {
  switch (side) {
    case "d":
      return "Defense";
    case "p":
      if (caseType.toLowerCase() === "criminal") return "Prosecution";
      if (caseType.toLowerCase() === "civil") return "Plaintiff";
      return "-";
    default:
      return "-";
  }
}