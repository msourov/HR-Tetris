import { useEffect, useState, FC, createContext, useMemo } from "react";
import Cookies from "js-cookie";
import { AuthProviderProps } from "./authTypes";
import { AuthContextProps } from "./authTypes";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("token in authcontext", token);
    if (token) {
      setToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      logout,
      token,
    }),
    [isAuthenticated, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
