import { useEffect, useState, FC, createContext } from "react";
import Cookies from "js-cookie";
import { AuthProviderProps } from "./authTypes";
import { AuthContextProps } from "./authTypes";
import { getToken } from "../utils/getToken";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    console.log("token in authcontext", token);
    if (token) {
      setToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
