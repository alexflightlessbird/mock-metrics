import { notifications } from "@mantine/notifications";

export default function useNotifications() {
  const showNotification = ({
    title,
    message,
    color = "blue",
    position = "bottom-right",
  }) => {
    notifications.show({
      title,
      message,
      color,
      position,
    });
  };

  const showSuccess = ({ message, title = "Success" }) => {
    showNotification({ title, message, color: "green" });
  };

  const showError = ({ message, title = "Error" }) => {
    showNotification({ title, message, color: "red" });
  };

  return { showNotification, showSuccess, showError };
}
