import { LuGlobe } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import AnnouncementBanner from "../common/components/AnnouncementBanner";

export default function DomainMigrationNotice({ mb }) {
  const location = useLocation();

  if (
    window.location.hostname !== "mock-metrics.onrender.com" &&
    !import.meta.env.DEV
  ) {
    return null;
  }

  const destination = `https://mock-metrics.com${location.pathname}${location.search}${location.hash}`;

  return (
    <AnnouncementBanner
      label="New official website"
      title="MockMetrics has moved to its new home!"
      description="For the best experience, please visit the official website. Thank you for your support!"
      actionLabel="Visit mock-metrics.com"
      actionHref={destination}
      icon={<LuGlobe size="1.25rem" />}
      color="blue"
      mb={mb}
    />
  );
}
