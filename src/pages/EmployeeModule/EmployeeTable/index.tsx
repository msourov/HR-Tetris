import { Box, Table } from "@mantine/core";
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

  console.log(employees);

  return (
    <Box>
      <Table>
        <TableHeading />
        <TableItem
          data={employees?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
    </Box>
  );
};

export default EmplyeeTable;
