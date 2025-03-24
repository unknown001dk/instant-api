import { notification } from "antd";

export const NotificationSucess = (message, description) => {
  notification.success({
    message,
    description,
    duration: 5,
  });
}

export const NotificationError = (message, description) => {
  notification.error({
    message,
    description,
    duration: 5,
  });
}