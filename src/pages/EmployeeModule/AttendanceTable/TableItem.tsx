import { Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import CommonSkeleton from "../../../components/shared/CommonSkeleton";
import { Attendance } from "../../../features/types/attendance";

interface TableItemProps {
  data: Attendance[];
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
    <Table.Tbody className="text-black font-medium border-b bg-gray-100">
      {data.map((item, index) => (
        <Table.Tr key={item.uid} className="hover:bg-white">
          <Table.Td
            className="w-[2%] pl-[2rem]"
            // style={{ width: "2%", padding: "12px", paddingLeft: "32px" }}
          >
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "10%", padding: "12px" }}>
            {item.employee_id}
          </Table.Td>
          <Table.Td style={{ width: "10%", padding: "12px" }}>
            {item.is_attend ? (
              <Pill className="bg-green-600 text-white">Present</Pill>
            ) : (
              <Pill className="bg-red-600 text-white">Absent</Pill>
            )}
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
