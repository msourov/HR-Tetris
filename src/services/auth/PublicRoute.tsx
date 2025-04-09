import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/getToken";

const PublicRoute = () => {
  const token = getToken();
  // Redirect authenticated users away from the login page
  if (token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
