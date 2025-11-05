import {
  Stack,
  Text,
  SimpleGrid,
  Grid,
  rem,
  Title,
  Anchor,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import PageSection from "../common/components/PageSection";
import { useNavigate } from "react-router-dom";
import Card from "../common/components/card/Card";

export default function ErrorExplanationPage() {
  const navigate = useNavigate();

  const errors = {
    "Page Not Found": [
      {
        code: 404,
        explanation: "The page you're looking for doesn't exist or has moved",
        fix: "Check the URL or return to the homepage",
      },
    ],
    "Access Issues": [
      {
        code: 401,
        explanation: "You need to log in to see this content",
        fix: "Sign in to your account",
      },
      {
        code: 403,
        explanation: "You don't have permission to view this",
        fix: "Contact support if you think this is wrong",
      },
      {
        code: 402,
        explanation: "This feature requires a paid plan",
        fix: "Upgrade your subscription",
      },
    ],
    "Server Problems": [
      {
        code: 500,
        explanation: "Something went wrong on our end",
        fix: "Try again in a few minutes",
      },
      {
        code: 503,
        explanation: "Our services are temporarily down",
        fix: (
          <span>
            Check our{" "}
            <Anchor
              href="/status"
              onClick={(e) => {
                e.preventDefault();
                navigate("/status");
              }}
            >
              status page
            </Anchor>{" "}
            for updates
          </span>
        ),
      },
    ],
    "Special Cases": [
      {
        code: 418,
        explanation: "A playful error for impossible requests",
        fix: "Try a different action",
      },
      {
        code: 429,
        explanation: "You're making too many requests too quickly",
        fix: "Slow down and try again later",
      },
    ],
  };

  return (
    <BasePage titleText="Understanding Error Messages">
      <Grid gutter="xl">
        <Grid.Col span={12}>
          <Stack gap="xl">
            <Text size="lg">
              When something goes wrong, we'll show you an error code with a
              simple explanation. Here's what they mean:
            </Text>

            {Object.entries(errors).map(([category, errorList]) => (
              <PageSection key={category} title={category}>
                <SimpleGrid
                  cols={{ base: 1, sm: 2 }}
                  spacing="md"
                  verticalSpacing="md"
                >
                  {errorList.map((error) => (
                    <Card key={error.code}>
                      <Title order={3} size="h4" c="blue">
                        <Anchor
                          underline="hover"
                          href={`/${error.code}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${error.code}`);
                          }}
                          inherit
                        >
                          Error {error.code}
                        </Anchor>
                      </Title>
                      <Text mt={rem(8)}>{error.explanation}</Text>
                      <Text mt={rem(8)} c="dimmed">
                        What to do: {error.fix}
                      </Text>
                    </Card>
                  ))}
                </SimpleGrid>
              </PageSection>
            ))}
          </Stack>
        </Grid.Col>
      </Grid>
    </BasePage>
  );
}
