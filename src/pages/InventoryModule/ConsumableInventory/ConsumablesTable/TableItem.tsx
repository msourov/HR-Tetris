import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Consumable } from "../../../../features/types/inventory";
import { SerializedError } from "@reduxjs/toolkit";
import { Table } from "@mantine/core";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import ConsumableActions from "./ConsumableActions";

interface TableItemProps {
  data: Consumable[];
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
    return <CommonSkeleton cols={7} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching users" />;
  }

  return (
    <Table.Tbody className="text-black font-medium border-b bg-gray-100">
      {data.map((item, index) => (
        <Table.Tr key={item.uid} className="hover:bg-white text-emerald-950">
          <Table.Td style={{ width: "5%", paddingLeft: "1.5rem" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "20%" }}>{item.name || "N/A"}</Table.Td>
          <Table.Td style={{ width: "10%" }}>{item.price || "N/A"}</Table.Td>
          <Table.Td style={{ width: "10%" }}>{item.quantity || "N/A"}</Table.Td>
          <Table.Td style={{ width: "15%" }}>{item.buyer_id || "N/A"}</Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.create_at || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "8%" }}>
            <ConsumableActions data={item} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
