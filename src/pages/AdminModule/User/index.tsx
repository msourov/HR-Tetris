import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const User: React.FC = () => {
  return (
    <div>
      <AppPageHeader
        Heading="User"
        Breadcrumb={{ module: "Admin Management", page: "User" }}
      />
      <div className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default User;
