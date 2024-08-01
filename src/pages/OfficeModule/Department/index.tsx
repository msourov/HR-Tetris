import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";

const Department = () => {
  return (
    <Box className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg p-10">
      <Outlet />
    </Box>
  );
};

export default Department;
