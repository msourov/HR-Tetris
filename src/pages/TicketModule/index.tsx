import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";

const TicketLayout = () => {
  return (
    <Box className="flex flex-col h-screen">
      <PageHeader
        Heading="Ticket"
        Breadcrumb={{ module: "Ticket Management", page: "List" }}
      />
      <Box className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default TicketLayout;
