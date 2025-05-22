import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const TaskLayout = () => {
  return (
    <div className="flex flex-col">
      <AppPageHeader
        Heading="Employee"
        Breadcrumb={{ module: "Employee Management", page: "List" }}
      />
      <div className="w-[95%] mb-8 mx-auto max-h-fit rounded-lg drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </div>
    </div>
  );
};

export default TaskLayout;
