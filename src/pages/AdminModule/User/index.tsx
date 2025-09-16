import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const User: React.FC = () => {
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg">
      <AppPageHeader
        Heading="User"
        Breadcrumb={{ module: "Admin Management", page: "User" }}
      />
      <Outlet />
    </div>
  );
};

export default User;
