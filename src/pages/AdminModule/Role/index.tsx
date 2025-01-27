import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const Role = () => {
  return (
    <div>
      <AppPageHeader
        Heading="Role"
        Breadcrumb={{ module: "Admin Management", page: "Role" }}
      />
      <div className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </div>
    </div>
  );
};

export default Role;
