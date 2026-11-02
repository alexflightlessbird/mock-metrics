import { List, Stack, Text } from "@mantine/core";
import BasePage from "../common/components/BasePage";
import PageSection from "../common/components/PageSection";
import SupportLink from "../common/components/SupportLink";

export default function PrivacyAndSecurityPage() {
  return (
    <BasePage titleText="Privacy & Security">
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Last updated: November 1, 2026
        </Text>

        <PageSection title="information we handle">
          <Text>
            MockMetrics helps schools and teams manage mock trial activities and
            review performance. Depending on how you use the service, we may
            handle:
          </Text>
          <List withPadding>
            <List.Item>
              Account information, such as your email address, name, and school
              or team account memberships.
            </List.Item>
            <List.Item>
              School and mock trial information entered by users, which may
              include school, team, and student names; tournaments; round
              details; witness and role selections; and scoring information.
            </List.Item>
            <List.Item>
              Information you send to support, such as your message and any
              details or files you choose to include.
            </List.Item>
          </List>
        </PageSection>

        <PageSection title="how we use information">
          <Text>We use information to:</Text>
          <List withPadding>
            <List.Item>
              Provide account access and the service features you request,
              including organizing school data and generating performance
              analysis.
            </List.Item>
            <List.Item>
              Respond to support requests, maintain and improve the service,
              protect accounts and systems, and address misuse or security
              incidents.
            </List.Item>
            <List.Item>
              Meet legal obligations and respond to valid legal requests.
            </List.Item>
          </List>
        </PageSection>

        <PageSection title="school data, support access, and sharing">
          <Text>
            Round details, witness selections, and scoring information are used
            to provide MockMetrics features to authorized users of the relevant
            school or team account. Support staff do not routinely browse school
            accounts or review these records. Access by authorized personnel is
            limited to situations where it is reasonably necessary to resolve a
            support request, maintain or secure the service, or comply with law.
            When helping with a request, we aim to use only the information
            needed and, where practicable, work from details you provide rather
            than inspecting unrelated records.
          </Text>
          <Text>
            <Text span fw={600}>
              We do not sell, rent, trade, license, or otherwise exchange user
              data or school data for money or anything of value, directly or
              indirectly. We do not use it for targeted advertising.
            </Text>{" "}
            We use service providers, including Supabase for authentication and
            database services, to operate MockMetrics. They may process
            information to provide those services. We may also disclose
            information when required by law or when reasonably necessary to
            protect users, the service, or others.
          </Text>
        </PageSection>

        <PageSection title="schools and student information">
          <Text>
            School administrators (also known as primary admins) manage who is
            given access to their school's account. If you enter information
            about students or other people, you and your school are responsible
            for having the authority and permissions required to provide it to
            MockMetrics. Please enter only information needed to use the
            service, and avoid putting highly sensitive information in notes or
            support messages.
          </Text>
          <Text>
            If you are a student, parent, or legal guardian with a question or
            request about school-managed information, contact your school
            administrator. You may also <SupportLink>contact us</SupportLink>.
          </Text>
        </PageSection>

        <PageSection title="browser storage">
          <Text>
            MockMetrics uses browser local storage and session storage for
            authentication, preferences, selected school, and some temporary
            form drafts. Local storage can remain in your browser after you
            close a page; session storage is generally limited to a browser tab.
            Information saved in a draft may be sent to our database when you
            submit it. Clearing browser storage may sign you out or remove
            unsaved work.
          </Text>
        </PageSection>

        <PageSection title="retention and your choices">
          <Text>
            We keep information for as long as needed to provide the service and
            for legitimate operational needs, such as security, dispute
            resolution, and legal obligations. If information is deleted, it may
            remain in backups for a limited time or where retention is legally
            required.
          </Text>
          <Text>
            Depending on your location and the type of information, you may have
            rights to request access, correction, deletion, or a copy of
            personal information. For school-managed records, contact your
            school administrator. For account or other privacy requests,{" "}
            <SupportLink>contact support</SupportLink>; we may need to verify
            your identity and coordinate with the school that manages the
            records.
          </Text>
        </PageSection>

        <PageSection title="security">
          <Text>
            We take reasonable steps designed to protect information from
            unauthorized access, loss, or misuse, and rely on service providers
            for functions such as authentication and database hosting. No online
            service or method of storage can be guaranteed completely secure.
            Please use a unique password, keep your sign-in details private, and
            let us know if you believe an account or information has been
            compromised.
          </Text>
          <Text>
            For privacy questions, data requests, or security concerns,{" "}
            <SupportLink>contact our support team</SupportLink>.
          </Text>
        </PageSection>
      </Stack>
    </BasePage>
  );
}
