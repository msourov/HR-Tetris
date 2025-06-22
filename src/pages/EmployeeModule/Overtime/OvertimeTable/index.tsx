import { Table } from "@mantine/core";
import TableItem from "./TableItem";
import TableHeading from "./TableHeading";
import { useGetAllOvertimeQuery } from "../../../../features/api/overtimeSlice";

const OvertimeTable: React.FC = () => {
  const { data, error, isLoading } = useGetAllOvertimeQuery({
    page: 1,
    limit: 10,
  });
  const overtimeData = Array.isArray(data?.data)
    ? data.data
    : data
    ? [data.data]
    : [];


  return (
    <>
      <Table>
        <TableHeading />
        <TableItem data={overtimeData} isLoading={isLoading} error={error} />
      </Table>
    </>
  );
};

export default OvertimeTable;
