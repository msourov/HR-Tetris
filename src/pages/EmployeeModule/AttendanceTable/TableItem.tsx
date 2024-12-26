import { Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import CommonSkeleton from "../../../components/shared/CommonSkeleton";

interface AttendanceLog {
  id: number;
  employee_id: string;
  is_attend: boolean;
  attended_date: string;
  is_home_office: boolean | null;
}

interface TableItemProps {
  data: AttendanceLog[];
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
    return <CommonSkeleton cols={5} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching attendance logs" />;
  }

  return (
    <Table.Tbody className="text-gray-600 font-semibold">
      {data.map((item, index) => (
        <Table.Tr key={item.id}>
          <Table.Td style={{ width: "2%", padding: "12px" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "10%", padding: "12px" }}>
            {item.employee_id}
          </Table.Td>
          <Table.Td style={{ width: "10%", padding: "12px" }}>
            {item.is_attend ? "Present" : "Absent"}
          </Table.Td>
          <Table.Td style={{ width: "10%", padding: "12px" }}>
            {new Date(item.attended_date).toLocaleDateString()}
          </Table.Td>
          <Table.Td style={{ width: "15%", padding: "12px" }}>
            {item.is_home_office === null
              ? "N/A"
              : item.is_home_office
              ? "Home Office"
              : "Office"}
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
