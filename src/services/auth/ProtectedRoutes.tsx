import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getToken } from "../utils/getToken";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  // if (isAuthenticated) {
  //   return <Outlet />;
  // }
  const token = getToken();
  if (token) {
    return <Outlet />;
  }
  console.log("isAuthenticated inside ProtectedRoute", isAuthenticated);
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
