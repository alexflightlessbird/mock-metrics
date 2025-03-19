import { useContext } from "react";

import { SessionContext } from "../../context/auth/SessionContext";

export const useSession = () => useContext(SessionContext);
