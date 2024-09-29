import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/getToken";
import { useAuth } from "./useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const token = getToken();
  if (token) {
    return <Outlet />;
  }
  console.log("isAuthenticated inside ProtectedRoute", isAuthenticated);
  return <Navigate to="/login" />;
  // const isOTPRequired = Boolean(localStorage.getItem("OtpPending"));

  // if (isOTPRequired && window.location.pathname !== "/otp") {
  //   return <Navigate to="/otp" />;
  // }
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
