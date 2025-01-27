import { Outlet } from "react-router-dom";
import AppPageHeader from "../../components/core/AppPageHeader";

const EmployeeLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <AppPageHeader
        Heading="Employee"
        Breadcrumb={{ module: "Employee Management", page: "List" }}
      />
      <div className="w-[95%] mb-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
