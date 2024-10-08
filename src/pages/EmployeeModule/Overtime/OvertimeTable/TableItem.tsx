import { Loader, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { OvertimeData } from "../../../../features/api/types";

interface TableItemProps {
  data: OvertimeData[];
  isLoading: boolean;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const TableItem: React.FC<TableItemProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    <Loader type="dots" className="self-center" />;
  }
  if (error) {
    <ErrorAlert message="Error fetching users" />;
  }

  return (
    <Table.Tbody>
      {data.map((item, index) => (
        <Table.Tr key={index}>
          <Table.Td>{index + 1}</Table.Td>
          <Table.Td>{item.employee_id}</Table.Td>
          <Table.Td>{item.purpose}</Table.Td>
          <Table.Td>{new Date(item.start_time).toLocaleString()}</Table.Td>
          <Table.Td>{new Date(item.end_time).toLocaleString()}</Table.Td>
          <Table.Td>{item.is_approved}</Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
