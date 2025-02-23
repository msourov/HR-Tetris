import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Category } from "../../../../features/types/category";
import { SerializedError } from "@reduxjs/toolkit";
import { Table } from "@mantine/core";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import CategoryActions from "./CategoryActions";

interface TableItemProps {
  data: Category[];
  isLoading: boolean;
  error?:
    | { error: string; status: string }
    | FetchBaseQueryError
    | SerializedError;
}

const TableItem: React.FC<TableItemProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <CommonSkeleton cols={6} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching categories" />;
  }

  return (
    <Table.Tbody className="text-gray-800 font-medium border-b bg-gray-50">
      {data.map((item, index) => (
        <Table.Tr key={item.uid} className="hover:bg-gray-100">
          <Table.Td style={{ width: "5%", paddingLeft: "1.5rem" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "25%" }}>{item.name || "N/A"}</Table.Td>
          <Table.Td style={{ width: "25%" }}>{item.values || "N/A"}</Table.Td>
          <Table.Td style={{ width: "20%" }}>
            {item.model_type || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.create_at ? new Date(item.create_at).toLocaleString() : "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "5%" }}>
            <CategoryActions uid={item?.uid} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
