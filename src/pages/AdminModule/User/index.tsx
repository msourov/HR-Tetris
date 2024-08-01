import { Box } from "@mantine/core";
import PageHeader from "../../../components/shared/PageHeader";
import { Outlet } from "react-router-dom";

const User: React.FC = () => {
  return (
    <Box>
      <PageHeader
        Heading="User"
        Breadcrumb={{ module: "Admin Management", page: "User" }}
      />
      <Box className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg">
        <Outlet />
      </Box>
    </Box>
  );
};

export default User;
