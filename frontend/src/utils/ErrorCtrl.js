import { NotificationError } from "./Notification";

export const ErrorCtrl = (error, msg) => {
  console.error("Error updating profile:", error);

  // Handling different types of errors (e.g., network error or invalid credentials)
  if (error.response) {
    NotificationError(
      `${msg} failed`,
      error.response.data.message || "Invalid credentials"
    );
  } else {
    NotificationError(
      `${msg} failed`,
      "Something went wrong, please try again"
    );
  }
};
