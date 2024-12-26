import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const User: React.FC = () => {
  return (
    <Box>
      <AppPageHeader
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
