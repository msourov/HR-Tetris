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
import UserImage from "../../../../components/core/UserImage";

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
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40 }}>
                <UserImage
                  src={getImageUrl(item?.mobile)}
                  size={40}
                  className="border"
                />
              </div>

              <span className="text-sm font-medium text-gray-800 truncate">
                {item.name}
              </span>
            </div>
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
              className={`py-1 rounded text-xs font-semibold w-fit ${
                item.role_name === "Super Admin"
                  ? "text-purple-700"
                  : (item.role_name === "Role not found" ? "text-red-600" :"text-gray-700")
              }`}
            >
              {item?.role_name ? item.role_name : "N/A"}
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
            <UserActions id={item?.uid} name={item?.name} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
