import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Consumable } from "../../../../features/types/inventory";
import { SerializedError } from "@reduxjs/toolkit";
import { Table } from "@mantine/core";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import ConsumableActions from "./ConsumableActions";
import { IconChefHat } from "@tabler/icons-react";

interface TableItemProps {
  data: Consumable[];
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
    return <CommonSkeleton cols={7} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching users" />;
  }

  return (
    <Table.Tbody className="text-black font-medium border-b bg-gray-100">
      {data.map((item, index) => (
        <Table.Tr key={item.uid} className="hover:bg-white text-emerald-950">
          <Table.Td style={{ width: "5%", paddingBlock: "0.75rem" }}>
            {(page - 1) * limit + index + 1}
          </Table.Td>
          <Table.Td style={{ width: "30%", display: "flex", gap: "0.5rem" }}>
            <IconChefHat className="text-orange-400" size={20} />
            <span>{item.name || "N/A"}</span>
          </Table.Td>
          <Table.Td style={{ width: "5%" }}>{item.price || "N/A"}</Table.Td>
          <Table.Td style={{ width: "5%" }}>{item.quantity || "N/A"}</Table.Td>
          <Table.Td style={{ width: "10%" }}>{item.buyer_id || "N/A"}</Table.Td>
          <Table.Td style={{ width: "10%" }}>
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
