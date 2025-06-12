import { setDocumentTitle } from "../utils/helpers";
import { AddIcon, EditIcon, DeleteIcon } from "../common/components/ActionIcons";
import { Box, Flex, Text, useMantineTheme } from "@mantine/core";
import IconButton from "../common/components/IconButton";

export default function Test() {
  const theme = useMantineTheme();
  setDocumentTitle({ title: "Test" });

  console.log(Object.keys(theme.colors));

  const colors = Object.keys(theme.colors);

  return (
    <div>
      <h1>Testing Page</h1>
      <IconButton buttonText="Testing" icon="add" />
      {colors && (colors.map((color) => {
        let boxProps = {};
        if (color === "lightGray") boxProps.bg = theme.colors.darkBlue;
        return (
          <>
          <Text>{color}</Text>
            <Box key={color} {...boxProps}>
              {Array.from({ length: 10 }).map((_, shade) => (
                <Box key={color + shade}>
                  <Text c={theme.colors[color][shade]}>{color} | {shade}</Text>
                  <Flex>
                    <AddIcon color={color} colorLoc={shade} />
                    <EditIcon color={color} colorLoc={shade} />
                    <DeleteIcon color={color} colorLoc={shade} />
                  </Flex>
                </Box>
              ))}
              <br />
            </Box>
          </>
        )
      }))}
    </div>
  );
}
