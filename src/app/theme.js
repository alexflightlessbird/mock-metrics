// Dependency imports
import { createTheme } from "@mantine/core";

const theme = createTheme({
    colors: {
      darkBlue: ["#0a1f3c"],
      lightGray: ["#f7f5f3"],
      primaryBlue: ["#2dace6"],
    },
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