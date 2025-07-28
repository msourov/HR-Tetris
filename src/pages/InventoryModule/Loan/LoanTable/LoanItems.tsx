import { Avatar, Badge, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import LoanActions from "./LoanActions";
import { LoanWithGuarantorObj } from "../../../../features/types/inventory";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";

interface TableItemProps {
  data: LoanWithGuarantorObj[];
  isLoading: boolean;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const LoanTableItems = ({ data, isLoading, error }: TableItemProps) => {
  if (isLoading) return <CommonSkeleton cols={9} />;
  console.log(error, "error");

  return (
    <Table.Tbody>
      {data.map((item, index: number) => (
        <Table.Tr key={item.uid}>
          <Table.Td className="w-1/20">{index + 1}</Table.Td>
          <Table.Td className="w-1/5">{item.name}</Table.Td>
          <Table.Td className="w-1/10">
            ৳{item.price?.toLocaleString()}
          </Table.Td>
          <Table.Td className="w-1/10">
            <Badge color="blue">{item.category}</Badge>
          </Table.Td>
          <Table.Td className="w-3/20">
            <div className="flex items-center gap-2">
              <Avatar src={item.employee?.employee_image} size="sm" />
              <div>
                <p>{item.employee?.employee_name}</p>
                <p className="text-xs text-gray-600">
                  {item.employee?.employee_id}
                </p>
              </div>
            </div>
          </Table.Td>
          <Table.Td className="w-3/20">
            <div className="flex items-center gap-2">
              <Avatar src={item.guarantor?.guarantor_image} size="sm" />
              <div>
                <p>{item.guarantor?.guarantor_name}</p>
                <p className="text-xs text-gray-600">
                  {item.guarantor?.guarantor_id}
                </p>
              </div>
            </div>
          </Table.Td>
          <Table.Td className="w-1/10">
            <AppApprovalStatus status={item.is_admin_approve} />
          </Table.Td>
          <Table.Td className="w-1/10">
            {new Date(item.create_at).toLocaleDateString()}
          </Table.Td>
          <Table.Td className="w-1/20">
            <LoanActions data={item} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default LoanTableItems;
