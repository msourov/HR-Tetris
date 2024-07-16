import { Box } from "@mantine/core";
import PageHeader from "../../../components/shared/PageHeader";

const Role = () => {
  return (
    <div>
      <Box>
        <PageHeader
          Heading="Role"
          Breadcrumb={{ module: "Admin Management", page: "Role" }}
        />
      </Box>
    </div>
  );
};

export default Role;
