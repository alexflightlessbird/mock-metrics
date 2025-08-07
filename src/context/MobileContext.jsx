import { useMemo, createContext, useContext } from "react";
import { useViewportSize } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";
import { emToPx } from "../common/utils/helpers";

const MobileContext = createContext();

export function MobileProvider({ children }) {
  const theme = useMantineTheme();
  const { width } = useViewportSize();
  const smBreakpointPx = useMemo(
    () => emToPx(parseFloat(theme.breakpoints.sm)),
    [theme.breakpoints.sm]
  );
  const isMobile = width < smBreakpointPx;

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useMobile() {
  return useContext(MobileContext);
}
