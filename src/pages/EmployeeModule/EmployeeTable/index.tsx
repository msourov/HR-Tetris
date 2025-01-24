import { Box, Pagination, Table } from "@mantine/core";
import { useGetEmployeesQuery } from "../../../features/api/employeeSlice";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";

const EmplyeeTable = () => {
  const {
    data: employees,
    isLoading,
    error,
  } = useGetEmployeesQuery({
    page: 1,
    limit: 10,
  });

  return (
    <Box>
      <Table verticalSpacing="sm">
        <TableHeading />
        <TableItem
          data={employees?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <Box className="px-4 pt-8 pb-4 float-right">
        <Pagination total={4} color="rgb(33, 41, 34)" />
      </Box>
    </Box>
  );
};

export default EmplyeeTable;
