import { Outlet } from "react-router-dom";
import AppPageHeader from "../../components/core/AppPageHeader";

const EmployeeLayout = () => {
  return (
    <div className="w-[95%] lg:w-[90%] min-h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg mb-8">
      <AppPageHeader
        Heading="Employee"
        Breadcrumb={{ module: "Employee Management", page: "Employee" }}
      />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
