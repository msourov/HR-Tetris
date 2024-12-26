import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppPageHeader from "../../components/core/AppPageHeader";

const EmployeeLayout = () => {
  return (
    <Box className="flex flex-col h-screen">
      <AppPageHeader
        Heading="Employee"
        Breadcrumb={{ module: "Employee Management", page: "List" }}
      />
      <Box className="w-[95%] my-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
