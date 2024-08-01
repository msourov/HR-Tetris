import { Box } from "@mantine/core";
import PageHeader from "../../../components/shared/PageHeader";
import { Outlet } from "react-router-dom";

const Role = () => {
  return (
    <Box>
      <PageHeader
        Heading="Role"
        Breadcrumb={{ module: "Admin Management", page: "Role" }}
      />
      <Box className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Role;
