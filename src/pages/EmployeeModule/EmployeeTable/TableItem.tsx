import { Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import { Employee } from "../../../features/api/typesOld";
import EmployeeActions from "./EmployeeActions";
import CommonSkeleton from "../../../components/shared/CommonSkeleton";

interface TableItemProps {
  data: Employee[];
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
    return <CommonSkeleton cols={9} rows={5} />;
  }
  if (error) {
    <ErrorAlert message="Error fetching users" />;
  }

  return (
    <>
      <Table.Tbody className="text-gray-600 font-semibold">
        {data.map((item, index) => (
          <Table.Tr>
            <Table.Td style={{ width: "2%" }}>{index + 1}</Table.Td>
            <Table.Td style={{ width: "15%" }}>{item?.name}</Table.Td>
            <Table.Td style={{ width: "10%" }}>{item?.employee_id}</Table.Td>
            <Table.Td style={{ width: "10%" }}>{item?.phone}</Table.Td>
            <Table.Td style={{ width: "10%" }}>{item?.email}</Table.Td>
            <Table.Td style={{ width: "10%" }}>
              {item?.shift_and_schedule?.name}
            </Table.Td>
            <Table.Td style={{ width: "10%" }}>
              {item?.department?.name}
            </Table.Td>
            <Table.Td style={{ width: "10%" }}>
              {item?.designation?.name}
            </Table.Td>

            <Table.Td style={{ width: "5%" }}>
              <EmployeeActions id={item?.uid} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </>
  );
};

export default TableItem;
