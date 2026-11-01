import { Anchor } from "@mantine/core";

export const SUPPORT_EMAIL = "team@support.mock-metrics.com";
export const SUPPORT_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("MockMetrics support")}`;
export const SCHOOL_SETUP_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Add my school to MockMetrics")}&body=${encodeURIComponent(
  "Hello MockMetrics Support,\n\nI'd like to request that my school be added to MockMetrics.\n\nSchool name:\nCity and state:\nMy name and role:\n\nThank you,",
)}`;

export default function SupportLink({
  children = "Contact support",
  ...props
}) {
  return (
    <Anchor href={SUPPORT_HREF} {...props}>
      {children}
    </Anchor>
  );
}
