import { Pill, Table } from "@mantine/core";
import "../../../../styles.css";
import { User } from "../../../../features/api/typesOld";
import UserActions from "./UserActions";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";

interface TableItemProps {
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

const TableItem: React.FC<TableItemProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <CommonSkeleton cols={6} rows={5} />;
  }

  if (error) {
    <ErrorAlert message="Error fetching users" />;
  }
  return (
    <Table.Tbody>
      {data.map((item, index) => (
        <Table.Tr>
          <Table.Td style={{ width: "10%" }}>{index + 1}</Table.Td>
          <Table.Td style={{ width: "25%" }}>{item.name}</Table.Td>
          <Table.Td style={{ width: "25%" }}>{item.mobile}</Table.Td>
          <Table.Td style={{ width: "20%" }}>{item.role_name}</Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <Pill
              className={item.active ? "pill-active" : "pill-inactive"}
              style={{ textAlign: "center" }}
            >
              {item.active ? "Active" : "Inactive"}
            </Pill>
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <UserActions id={item?.uid} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
