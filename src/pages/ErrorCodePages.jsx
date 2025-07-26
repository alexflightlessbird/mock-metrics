import {
  Text,
  Button,
  Anchor,
  Center,
  Divider,
  Group,
  Space,
  Flex,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import GavelLoader from "../common/components/loader/GavelLoader";
import BasePage from "../common/components/BasePage";
import { LuGithub as GithubIcon } from "react-icons/lu";
import { capitalize } from "../common/utils/helpers";

function ErrorBase({
  errorNumber,
  errorType = "error",
  errorText,
  errorSecondaryText,
  svg = <GavelLoader scale={2} />,
  navigateLocation = "/",
  navigateButtonText = "Return to Home",
}) {
  const navigate = useNavigate();

  return (
    <BasePage
      titleText={
        <>
          <Text span inherit c="blue">
            {capitalize(errorType)} {errorNumber}
          </Text>
          {errorType === "rule"
            ? " Violation"
            : errorType === "motion"
            ? " Granted"
            : errorType === "objection"
            ? ""
            : errorType === "exhibit"
            ? " Submitted"
            : " Occurred"}
        </>
      }
      centerTitle
    >
      <Text ta="center" fz="xl" mb="md">
        "{errorText}"
      </Text>
      <Text ta="center" fz="lg">
        Court's Ruling:
      </Text>
      <Text ta="center" fz="md" mb="md">
        {errorSecondaryText}
      </Text>
      {svg}

      <Flex align="center" justify="center" gap="lg" mt="xl">
        <Button onClick={() => navigate(navigateLocation)}>
          {navigateButtonText}
        </Button>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </Flex>

      <Divider my="md" />

      <Text ta="center" fz="sm" c="dimmed">
        Think this is a mistake? Help us build a better case:{" "}
        <Anchor
          href="https://github.com/alexflightlessbird/mock-metrics/issues"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          fz="inherit"
        >
          file a feature request or bug report
        </Anchor>
        .
      </Text>
      <Center>
        <Button
          component="a"
          href="https://github.com/alexflightlessbird/mock-metrics/issues"
          target="_blank"
          rel="noopener noreferrer"
          leftSection={<GithubIcon />}
          variant="outline"
          color="dark"
          mt="md"
        >
          Submit to Github
        </Button>
      </Center>
    </BasePage>
  );
}

export function Error404() {
  return (
    <ErrorBase
      errorNumber="404"
      errorType="rule"
      errorText="Evidence of this page's prior existence is not admissible in court to prove it ever belonged here."
      errorSecondaryText={
        <>
          The judge (our system) has excluded this content under Rule 404.
          <br />
          This one appears to have been lost, moved, or never existed at all.
        </>
      }
    />
  );
}

export function Error403() {
  return (
    <ErrorBase
      errorNumber="403"
      errorType="rule"
      errorText="The probative value of this request is substantially outweighed by the danger of unfair prejudice to our servers."
      errorSecondaryText={
        <>
          The judge (our system) has excluded this content under Rule 403.
          <br />
          You lack proper authentication to view this evidence.
        </>
      }
    />
  );
}

export function Error401() {
  return (
    <ErrorBase
      errorNumber="401"
      errorType="rule"
      errorText="Your credentials don't make the existence of proper access more or less probable than it would be without them."
      errorSecondaryText={
        <>
          The judge (our system) has excluded this content under Rule 401.
          <br />
          You must introduce yourself to the court before continuing.
        </>
      }
      navigateLocation="/auth"
      navigateButtonText="Authenticate"
    />
  );
}

export function Error418() {
  return (
    <ErrorBase
      errorNumber="418"
      errorType="exhibit"
      errorText="The infamous 'I'm a teapot' discussion."
      errorSecondaryText={
        <>
          This request was clearly meant for a coffee pot.
          <br />
          The court cannot admit beverage-related evidence.
        </>
      }
    />
  );
}

export function Error503() {
  return (
    <ErrorBase
      errorNumber="503"
      errorType="motion"
      errorText="Motion for continuance due to witness unavailability."
      errorSecondaryText={
        <>
          Motion granted. Our services are currently giving testimony in another
          proceeding.
          <br />
          Please check the docket and try again shortly.
        </>
      }
      navigateButtonText="Check Docket Status"
      navigateLocation="/status"
    />
  );
}

export function Error500() {
  return (
    <ErrorBase
      errorNumber="500"
      errorType="motion"
      errorText="Motion for mistrial due to unexpected procedural error."
      errorSecondaryText={
        <>
          The court (our server) encountered an unexpected condition.
          <br />
          All parties are advised to take a recess and try again later.
        </>
      }
      navigateButtonText="Return After Recess"
    />
  );
}

export function Error402() {
  return (
    <ErrorBase
      errorNumber="402"
      errorType="objection"
      errorText="The court cannot grant entry when there are unpaid court fees."
      errorSecondaryText={
        <>
          This feature requires additional access privileges.
          <br />
          Court costs must be settled before proceeding.
        </>
      }
      navigateButtonText="View Subscription Options"
      navigateLocation="/pricing"
    />
  );
}
