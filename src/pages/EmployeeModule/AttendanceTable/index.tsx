import { Box, Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetAllAttendanceQuery } from "../../../features/api/attendanceSlice";

const EmplyeeTable = () => {
  const { data: attendance, isLoading, error } = useGetAllAttendanceQuery();

  return (
    <Box>
      <Table>
        <TableHeading />
        <TableItem
          data={attendance?.data || []}
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
