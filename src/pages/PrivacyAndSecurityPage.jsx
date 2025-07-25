import { Container, Title, Text, Space, List, Divider } from "@mantine/core";
import BasePage from "../common/components/BasePage";

export default function PrivacyAndSecurityPage() {
    return (
        <>
            <BasePage titleText="Privacy Policy">
                <Title order={2}>Data Collection</Title>
                <Text>We collect minimal personal data required for authentication and account management. This includes email addresses and authentication tokens stored securely in cookies.</Text>

                <Space h="md" />

                <Title order={2}>Cookies</Title>
                <Text>Our site uses strictly necessary cookies for authentication. These cookies are essential for the website to function and cannot be switched off.</Text>

                <Space h="md" />

                <Title order={2}>User Rights</Title>
                <Text>Users may request access to, correction of, or deletion of their personal data. Contact support for data-related requests.</Text>

                <Space h="xl" />

                <Divider />

                <Space h="md" />
            </BasePage>
            <BasePage titleText="Security Practices">
                <Title order={2}>Data Protection</Title>
                <Text>We implement the following security measures to protect your data:</Text>
                <List>
                    <List.Item>Secure HTTPS connections for all data transfers</List.Item>
                    <List.Item>Authentication tokens encrypted and securely stored</List.Item>
                    <List.Item>Regular security audits of our systems</List.Item>
                </List>

                <Space h="md" />

                <Title order={2}>Cookie Security</Title>
                <Text>Authentication cookies are marked as Secure and HttpOnly to prevent XSS attacks.</Text>

                <Space h="md" />

                <Title order={2}>Client-Side Storage</Title>
                <Text>We use the brower's local storage to remember your non-sensitive preferences (such as layouts and themes) for a better user experience. This data never leaves your device, is not used for tracking, and cannot be accessed by third parties.</Text>
            </BasePage>
        </>
    )
}