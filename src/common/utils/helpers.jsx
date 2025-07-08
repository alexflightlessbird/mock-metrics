export function capitalize(str) {
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
