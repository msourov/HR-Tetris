import { Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { Tangible } from "../../../../features/types/inventory";
import TangibleActions from "./TangibleActions";

interface TableItemProps {
  data: Tangible[];
  isLoading: boolean;
  error?:
    | { error: string; status: string }
    | FetchBaseQueryError
    | SerializedError;
}

const TableItem: React.FC<TableItemProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return <CommonSkeleton cols={9} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching tangible items" />;
  }
  console.log(data);

  return (
    <Table.Tbody className="text-gray-800 font-medium border-b bg-gray-50">
      {data.map((item, index) => (
        <Table.Tr key={item.uid} className="hover:bg-gray-100">
          <Table.Td style={{ width: "5%", paddingLeft: "1.5rem" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>{item.name || "N/A"}</Table.Td>
          <Table.Td style={{ width: "20%" }}>
            {item.descriptions || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "5%" }}>
            {item.quantity != null ? item.quantity : "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "5%" }}>
            {item.price != null ? `$${item.price}` : "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>{item.location || "N/A"}</Table.Td>
          <Table.Td style={{ width: "5%" }}>{item.category || "N/A"}</Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.create_at ? new Date(item.create_at).toLocaleString() : "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <TangibleActions data={item} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
