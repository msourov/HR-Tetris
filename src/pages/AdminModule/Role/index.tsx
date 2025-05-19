import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const Role = () => {
  return (
    <>
      <AppPageHeader
        Heading="Role"
        Breadcrumb={{ module: "Admin Management", page: "Role" }}
      />
      <div className="w-[95%] mb-20 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </div>
    </>
  );
};

export default Role;
