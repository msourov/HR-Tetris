import { Box } from "@mantine/core";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { Outlet } from "react-router-dom";

const CertificationLayout = () => {
  return (
    <Box className="flex flex-col h-screen">
      <AppPageHeader
        Heading="Certification"
        Breadcrumb={{ module: "Certification Management", page: "List" }}
      />
      <Box className="w-[95%] mb-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        <Outlet />
      </Box>
    </Box>
  );
};

export default CertificationLayout;
