import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { getToken } from "../../services/utils/getToken";
import { logout } from "../../features/auth/authSlice"; // Create this if not existing
import type { RootState } from "../../store"; // Adjust path to your store

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getToken() || (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    // Handle 401 Unauthorized
    if (result.error.status === 401) {
      // Dispatch logout action
      api.dispatch(logout());

      // Clear token from storage
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Redirect to login
      window.location.href = "/login";
    }

    // Handle other errors (optional)
    const errorData = result.error.data as { message?: string };
    const errorMessage = errorData?.message || "An unexpected error occurred";

    console.error("API Error:", {
      status: result.error.status,
      message: errorMessage,
    });
  }

  return result;
};

export default baseQueryWithErrorHandling;

// import { fetchBaseQuery } from "@reduxjs/toolkit/query";
// import { getToken } from "../../services/utils/getToken";

// const baseQuery = fetchBaseQuery({
//   baseUrl: import.meta.env.VITE_APP_BASE_URL,
//   prepareHeaders: (headers) => {
//     const token = getToken();
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     headers.set("Content-Type", "application/json");
//     return headers;
//   },
// });

// export default baseQuery;
