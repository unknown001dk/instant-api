export const IsUserLoggedIn = () => {
  const tokenData = sessionStorage.getItem("token");
  if (!tokenData) {
    window.location.href = "/login";
    return;
  }
};
