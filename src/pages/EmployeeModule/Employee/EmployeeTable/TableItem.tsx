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

  console.log(data);

  return (
    <Table.Tbody className="text-black font-medium border-b bg-gray-100">
      {data.map((item, index) => (
        <Table.Tr key={item.uid} className="hover:bg-white text-emerald-950">
          <Table.Td style={{ width: "2%", paddingLeft: "1.5rem" }}>
            {(page - 1) * limit + index + 1}
          </Table.Td>
          <Table.Td style={{ width: "23%" }}>
            <img
              src={getImageUrl(item?.work?.employee_id)}
              alt={item.personal?.name}
              className="w-10 h-10 rounded-full mr-2 inline-block"
              onError={handleImageError}
            />
            {item.personal?.name || "N/A"}
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
            <Pill className="bg-white">
              {item.work?.department?.name || "N/A"}
            </Pill>
          </Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.work?.designation?.name || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "5%", paddingRight: "1.5rem" }}>
            <EmployeeActions
              id={item.uid}
              name={item.personal?.name}
              department={item.work?.department?.name}
              designation={item.work?.designation?.name}
            />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
