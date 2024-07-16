import { Box } from "@mantine/core";
import PageHeader from "../../../components/shared/PageHeader";

const User: React.FC = () => {
  return (
    <Box>
      <PageHeader
        Heading="User"
        Breadcrumb={{ module: "Admin Management", page: "User" }}
      />
      
    </Box>
  );
};

export default User;
