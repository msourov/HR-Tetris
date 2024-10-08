import { Box, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";
import TableItem from "./TableItem";
import TableHeading from "./TableHeading";
import { useAllOvertimeQuery } from "../../../../features/api/overtimeSlice";

const OvertimeTable: React.FC = () => {
  const { data, error, isLoading } = useAllOvertimeQuery({
    page: 1,
    limit: 10,
  });
  const { logout } = useAuth();
  const overtimeData = data?.data || [];

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }

  return (
    <Box>
      <Table>
        <TableHeading />
        <TableItem data={overtimeData} isLoading={isLoading} error={error} />
      </Table>
    </Box>
  );
};

export default OvertimeTable;
