import { setDocumentTitle } from "../utils/helpers";
import Card from "../common/components/Card";
import { useMantineTheme } from "@mantine/core";

export default function Test() {
  const theme = useMantineTheme();
  setDocumentTitle({ title: "Test" });

  return (
    <div>
      <h1>Testing Page</h1>
      <Card
        content={{
          title: "Test",
          badge: {
            text: "Testing",
            color: theme.colors.darkBlue[0],
            fontColor: theme.colors.lightGray[0]
          },
          text: "This is the best day ever!"
        }}
      />
    </div>
  );
}
