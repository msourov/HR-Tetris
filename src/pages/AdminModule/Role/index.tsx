import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const Role = () => {
  return (
    <>
      <div className="w-[95%] mx-auto">
        <AppPageHeader
          Heading="Role"
          Breadcrumb={{ module: "Admin Management", page: "Role" }}
        />
      </div>

      <div className="w-[95%] mb-20 mx-auto max-h-fit drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </div>
    </>
  );
};

export default Role;
