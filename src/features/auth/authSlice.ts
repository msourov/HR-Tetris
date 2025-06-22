// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string | null;
    name: string | null;
  };
}

const tokenFromStorage = Cookies.get("token");
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("name");

const initialState: AuthState = {
  isAuthenticated: !!tokenFromStorage,
  token: tokenFromStorage ?? null,
  user: {
    id: userId ?? null,
    name: userName ?? null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        user: { id: string; name: string };
      }>
    ) => {
      const { token, user } = action.payload;
      Cookies.set("token", token, {
        expires: 7,
        secure: true, // only over HTTPS
        sameSite: "Strict",
      });
      localStorage.setItem("userId", user.id);
      localStorage.setItem("name", user.name);

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      Cookies.remove("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("name");

      state.token = null;
      state.user = { id: null, name: null };
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
