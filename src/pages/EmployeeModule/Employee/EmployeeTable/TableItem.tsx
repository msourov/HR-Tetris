import { Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import EmployeeActions from "./EmployeeActions";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import { Employee } from "../../../../features/types/employee";
import { getImageUrl } from "../../../../services/utils/getImageUrl";

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
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/employee_avatar.png";
  };

  if (isLoading) {
    return <CommonSkeleton cols={9} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching users" />;
  }

  return (
    <Table.Tbody
      className="text-gray-700 font-medium border-b bg-gray-100"
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
                <img
                  src={getImageUrl(item?.work?.employee_id)}
                  alt={item.personal?.name}
                  className="w-10 h-10 rounded-full object-cover border"
                  onError={handleImageError}
                />
                <span className="text-sm font-medium text-gray-800 truncate">
                  {item.personal?.name}
                </span>
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

            <Table.Td style={{ width: "10%" }}>
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
