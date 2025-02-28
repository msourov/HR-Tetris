import { Avatar, Badge, Modal, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";
import { SerializedError } from "@reduxjs/toolkit";
import LoanActions from "./LoanActions";
import { LoanWithGuarantorObj } from "../../../../features/types/inventory";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import { useDisclosure } from "@mantine/hooks";
import LoanDetails from "./LoanDetails";
import { useState } from "react";

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
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanWithGuarantorObj | null>(
    null
  );
  const { logout } = useAuth();

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    }
    return <Table.Td colSpan={9}>Error loading data</Table.Td>;
  }

  if (isLoading) return <Table.Td colSpan={9}>Loading...</Table.Td>;

  return (
    <Table.Tbody>
      {data.map((item, index: number) => (
        <Table.Tr
          key={item.uid}
          onClick={() => {
            setSelectedLoan(item);
            open();
          }}
        >
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
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {selectedLoan && <LoanDetails data={selectedLoan} closeModal={close} />}
      </Modal>
    </Table.Tbody>
  );
};

export default LoanTableItems;
