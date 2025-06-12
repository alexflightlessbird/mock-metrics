// Dependency imports
import { createTheme } from "@mantine/core";

const theme = createTheme({
    colors: {
      darkBlue: ["#0a1f3c"],
      lightGray: ["#f7f5f3"],
      primaryBlue: ["#2dace6"],
      errorRed: ["#ff6b6b"],
      emerald: ["#2ecc71"],
      sunshine: ["#f9ca24"],
      lavender: ["#9b59b6"],
      coral: ["#ff7f50"],
      mint: ["#48d1cc"],
      slate: ["#95a5a6"],
      forest: ["#27ae60"],
      peach: ["#ffb347"]
    },
    primaryShade: 0,
    primaryColor: "primaryBlue",
    fontFamily:
      "Inter, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    headings: {
      fontFamily: "Outfit, sans-serif",
      fontWeight: '700',
    },
    autoContrast: true,
    cursorType: "pointer",
    components: {
      Title: {
        styles: {
          root: {
            marginTop: "1.25rem",
            marginBottom: "1.25rem"
          }
        }
      }
    }
  });

  export { theme };