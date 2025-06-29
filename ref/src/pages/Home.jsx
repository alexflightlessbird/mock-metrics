import { setDocumentTitle } from "../utils/helpers";
import { Box, Grid, Title, useMantineTheme, em } from "@mantine/core";
import image from "../assets/graph.svg";
import { useMediaQuery } from "@mantine/hooks";

export default function Home() {
  setDocumentTitle({ isHomePage: true });
  const theme = useMantineTheme();
  const isSm = useMediaQuery(`(min-width: ${em(theme.breakpoints.sm)})`);

  const spanStyleEmp = {
    color: theme.colors.primaryBlue
  };
  const spanStyleSt = {
    fontSize: isSm ? "1.8rem" : "1.4rem",
    display: "inline-block",
    lineHeight: 1.1,
    margin: "-0.2em 0",
    whiteSpace: "nowrap"
  };

  const maxColHeight = "calc(100vh - 95px - 60px - 130px)";

  return (
    <div>
      <Title order={1}>Welcome to MockMetrics</Title>
      <Box style={{ maxHeight: maxColHeight }}>
        <Grid h="100%" gutter="sm" align="center">
          <Grid.Col span={{ base: 5, md: 4, lg: 3 }}>
            <Box
              h="100%"
              display="flex"
              style={{
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Title order={2} fz={{base: "2rem", sm: "3rem"}} fw={800} lh={1.3}>
                <span style={spanStyleEmp}>ANALYZE</span><br />
                <span style={spanStyleSt}>YOUR BALLOTS.</span>
                <br />
                <span style={spanStyleEmp}>TRACK</span><br />
                <span style={spanStyleSt}>YOUR WINS.</span>
                <br />
                <span style={spanStyleEmp}>OWN</span><br />
                <span style={spanStyleSt}>YOUR STATS.</span>
              </Title>
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 7, md: 8, lg: 9 }}>
            <Box h="100%" maw={maxColHeight} display="flex" style={{ alignItems: "center"}}>
              <img 
                alt="image" 
                src={image} 
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: maxColHeight,
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "left center",
                  borderRadius: "1rem"
                }}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
}