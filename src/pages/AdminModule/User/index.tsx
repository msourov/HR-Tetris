import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const User: React.FC = () => {
  return (
    <div className="flex flex-col">
      <AppPageHeader
        Heading="User"
        Breadcrumb={{ module: "Admin Management", page: "User" }}
      />
      <div className="w-[95%] mb-20 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default User;
