import { Pill, Table } from "@mantine/core";
import "../../../../styles.css";
import { User } from "../../../../features/api/typesOld";
import UserActions from "./UserActions";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import { IconPhone } from "@tabler/icons-react";

interface TableItemProps {
  page: number;
  limit: number;
  data: User[];
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
  page,
  limit,
  data,
  isLoading,
  error,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/employee_avatar.png";
  };

  if (isLoading) {
    return <CommonSkeleton cols={6} rows={5} />;
  }

  if (error) {
    <ErrorAlert message="Error fetching users" />;
  }
  return (
    <Table.Tbody>
      {data.map((item, index) => (
        <Table.Tr key={item.mobile}>
          <Table.Td
            style={{
              width: "10%",
              paddingLeft: "32px",
              paddingBlock: "0.5rem",
            }}
          >
            {(page - 1) * limit + index + 1}
          </Table.Td>
          <Table.Td style={{ width: "25%" }}>
            <img
              src={getImageUrl(item?.mobile)}
              alt={item?.name}
              className="w-10 h-10 rounded-full mr-2 inline-block"
              onError={handleImageError}
            />
            {item.name}
          </Table.Td>
          <Table.Td style={{ width: "25%" }}>
            <a
              href={`tel:${item.mobile}`}
              className="inline-flex items-center gap-2 p-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
            >
              <IconPhone size={16} className="text-blue-500" />
              {item.mobile}
            </a>
          </Table.Td>

          <Table.Td style={{ width: "20%" }}>
            <div
              className={`w-fit border p-1 rounded-full text-xs 
    ${
      item.role_name === "Super Admin"
        ? "bg-red-500 text-white border-red-600"
        : "bg-gray-500 text-white border-gray-500"
    }`}
            >
              {item.role_name}
            </div>
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <Pill
              className={`${
                item.active ? "pill-active" : "pill-inactive"
              } text-xs`}
            >
              {item.active ? "Active" : "Inactive"}
            </Pill>
          </Table.Td>
          <Table.Td style={{ width: "10%", paddingRight: "32px" }}>
            <UserActions id={item?.uid} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
