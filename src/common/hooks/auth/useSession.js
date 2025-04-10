// Dependency imports
import { useContext } from "react";

// Context imports
import { SessionContext } from "../../../contexts/SessionContext";

function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export { useSession };