import { Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import EmployeeActions from "./EmployeeActions";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import { Employee } from "../../../../features/types/employee";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import UserImage from "../../../../components/core/UserImage";

interface TableItemProps {
  data: Employee[];
  page: number;
  limit: number;
  isLoading: boolean;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const TableItem: React.FC<TableItemProps> = ({
  data,
  isLoading,
  error,
  page,
  limit,
}) => {
  if (isLoading) {
    return <CommonSkeleton cols={9} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching users" />;
  }

  console.log(data, data?.length);

  return (
    <Table.Tbody
      className="text-gray-700 font-medium border-b bg-gray-100 overflow-x-auto"
      style={{ fontSize: "13px" }}
    >
      {data.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={9} className="text-center py-6 text-gray-500">
            No employees found.
          </Table.Td>
        </Table.Tr>
      ) : (
        data.map((item, index) => (
          <Table.Tr key={item.uid} className="hover:bg-white">
            <Table.Td style={{ width: "2%", paddingLeft: "1rem" }}>
              {(page - 1) * limit + index + 1}
            </Table.Td>
            <Table.Td style={{ width: "25%" }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40 }}>
                  <UserImage
                    src={getImageUrl(item?.work?.employee_id)}
                    size={40}
                    className="border"
                  />
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-800 truncate min-w-[80px]">
                    {item.personal?.name}
                  </span>
                  {item?.work?.supervisor && (
                    <span className="text-xs text-green-500 font-semibold w-[80px] text-center px-1 py-0.5 rounded-md ring-1 ring-green-300 shadow-[0_0_6px_#22c55e]">
                      {item?.work?.supervisor ? "Supervisor" : ""}
                    </span>
                  )}
                </div>
              </div>
            </Table.Td>

            <Table.Td style={{ width: "5%" }}>
              {item.work?.employee_id || "N/A"}
            </Table.Td>
            <Table.Td style={{ width: "5%" }} className="">
              {item.personal?.phone || "N/A"}
            </Table.Td>
            <Table.Td style={{ width: "10%" }}>
              {item.personal?.email || "N/A"}
            </Table.Td>

            <Table.Td style={{ width: "5%" }}>
              {item?.work?.shift_and_schedule?.name ? (
                <Pill
                  className={`${
                    item?.work?.shift_and_schedule?.name.split(" ")[0] ===
                    "Morning"
                      ? "bg-yellow-500"
                      : "bg-orange-700"
                  } text-white`}
                >
                  {item?.work?.shift_and_schedule?.name.split(" ")[0] || "N/A"}
                </Pill>
              ) : null}
            </Table.Td>
            <Table.Td style={{ width: "10%" }}>
              <Pill className="bg-white">
                <span style={{ fontSize: "12px" }}>
                  {item.work?.department?.name || "N/A"}
                </span>
              </Pill>
            </Table.Td>
            <Table.Td style={{ width: "15%" }}>
              <span style={{ fontSize: "12px" }}>
                {item.work?.designation?.name || "N/A"}
              </span>
            </Table.Td>
            <Table.Td style={{ width: "5%", paddingRight: "1.5rem" }}>
              <EmployeeActions
                id={item.uid}
                eid={item.work.employee_id}
                name={item.personal?.name}
                department={item.work?.department?.name}
                designation={item.work?.designation?.name}
              />
            </Table.Td>
          </Table.Tr>
        ))
      )}
    </Table.Tbody>
  );
};

export default TableItem;
