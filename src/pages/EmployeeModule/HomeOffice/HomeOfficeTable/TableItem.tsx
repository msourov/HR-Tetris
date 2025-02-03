import { Modal, Pill, Table, Text } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import useFormatDate from "../../../../services/utils/useFormatDate";
import HomeOfficeDetail from "../HomeOfficeDetail";

interface HomeOffice {
  id: number;
  uid: string;
  employee_id: string;
  employee_name: string;
  purpose: string;
  home_office_start_date: string;
  home_office_end_date: string;
  is_approved: string;
}

interface TableItemProps {
  data: HomeOffice[];
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
  const [opened, { open, close }] = useDisclosure(false);
  const [currentUid, setCurrentUid] = useState<string>("");
  const { formatDate } = useFormatDate();

  if (isLoading) {
    return <CommonSkeleton cols={7} rows={5} />;
  }

  if (error) {
    return <ErrorAlert message="Error fetching home office requests" />;
  }

  return (
    <>
      <Table.Tbody className="text-black font-medium px-4 bg-gray-100 border">
        {data.map((item, index) => (
          <Table.Tr
            key={item.uid}
            className="cursor-pointer hover:bg-white"
            onClick={() => {
              open();
              setCurrentUid(item.uid);
            }}
          >
            <Table.Td style={{ width: "5%" }}>{index + 1}</Table.Td>
            <Table.Td style={{ width: "20%" }} className="text-sm">
              {item.employee_name || "N/A"}
            </Table.Td>
            <Table.Td style={{ width: "20%" }} className="text-sm">
              {item.employee_id || "N/A"}
            </Table.Td>
            <Table.Td style={{ width: "25%" }}>
              <Text lineClamp={3} className="text-sm">
                {item.purpose || "N/A"}
              </Text>
            </Table.Td>
            <Table.Td style={{ width: "15%" }}>
              <Pill className="bg-gray-200">
                {item.home_office_start_date
                  ? formatDate(item.home_office_start_date)
                  : "N/A"}
              </Pill>
            </Table.Td>
            <Table.Td style={{ width: "15%" }}>
              <Pill className="bg-gray-200">
                {item.home_office_end_date
                  ? formatDate(item.home_office_end_date)
                  : "N/A"}
              </Pill>
            </Table.Td>
            <Table.Td style={{ width: "10%" }}>
              <AppApprovalStatus status={item.is_approved} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Modal
        opened={opened}
        onClose={close}
        size="70%"
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 3,
        }}
      >
        {/* Replace this with the appropriate detail component */}
        <HomeOfficeDetail uid={currentUid} closeModal={close} />
      </Modal>
    </>
  );
};

export default TableItem;
