import { Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import EmployeeActions from "./EmployeeActions";
import CommonSkeleton from "../../../components/shared/CommonSkeleton";
import { Employee } from "../../../features/types/employee";

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
    return <ErrorAlert message="Error fetching users" />;
  }

  return (
    <Table.Tbody className="text-black font-medium border-b bg-gray-100">
      {data.map((item, index) => (
        <Table.Tr
          key={item.uid}
          className="hover:bg-white text-gray-500 font-semibold"
        >
          <Table.Td style={{ width: "2%", paddingLeft: "1.5rem" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.personal?.name || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "5%" }}>
            {item.work?.employee_id || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }} className="">
            {item.personal?.phone || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {item.personal?.email || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <Pill
              className={`${
                item.work?.shift_and_schedule?.name.split(" ")[0] === "Morning"
                  ? "bg-yellow-500"
                  : "bg-orange-700"
              } text-white`}
            >
              {item.work?.shift_and_schedule?.name.split(" ")[0] || "N/A"}
            </Pill>
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {item.work?.department?.name || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.work?.designation?.name || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "5%", paddingRight: "1.5rem" }}>
            <EmployeeActions id={item.uid} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
