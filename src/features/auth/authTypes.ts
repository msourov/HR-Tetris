// src/authTypes.ts
import { ReactNode } from "react";

export interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
