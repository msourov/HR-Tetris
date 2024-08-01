import Cookies from "js-cookie";

export const getToken = (): string | null => {
  const token = Cookies.get("token");
  return token ? token : null;
};
