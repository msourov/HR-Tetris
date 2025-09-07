import { Modal, Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import { Attendance } from "../../../../features/types/attendance";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import AttendanceDetail from "./AttendanceDetail";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import UserImage from "../../../../components/core/UserImage";

interface TableItemProps {
  data: Attendance[];
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
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const { formatDate } = useFormatDate();

  const handleAttendanceOpen = async (uid: string) => {
    setSelectedAttendance(uid);
    open();
  };

  if (isLoading) {
    return <CommonSkeleton cols={7} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching attendance logs" />;
  }
  return (
    <Table.Tbody className="text-black font-medium border-b bg-gray-100">
      {data.map((item, index) => (
        <Table.Tr
          key={item.uid}
          className="hover:bg-white hover:cursor-pointer text-emerald-950 py-4"
          onClick={() => handleAttendanceOpen(item?.uid)}
        >
          <Table.Td className="w-[5%] pl-[1rem]">{index + 1}</Table.Td>
          <Table.Td className="w-[15%]">
            <div className="flex items-center gap-2">
              <UserImage
                src={getImageUrl(item.employee_id)}
                size={40}
                className="border"
              />
              <span>{item.employee_name}</span>
            </div>
          </Table.Td>
          <Table.Td className="w-[10%]">{item.employee_id}</Table.Td>
          <Table.Td className="w-[10%]">
            {item.is_attend ? (
              <Pill
                className={`text-white ${
                  item.is_late ? "bg-yellow-600" : "bg-green-600"
                }`}
              >
                {item.is_late ? "Late" : "Present"}
              </Pill>
            ) : (
              <Pill className="bg-red-600 text-white">Absent</Pill>
            )}
          </Table.Td>
          <Table.Td className="w-[15%]">
            {formatDate(item.start_attended_date)}
          </Table.Td>
          <Table.Td className="w-[15%]">
            {formatDate(item.end_attended_time, true)}
          </Table.Td>
          <Table.Td
            className={`w-[10%] font-semibold ${
              item.is_home_office ? "text-orange-500" : "text-blue-500"
            }`}
          >
            {item.is_home_office === null
              ? "Office"
              : item.is_home_office
              ? "Home"
              : "Office"}
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
        //   scrollAreaComponent={ScrollArea.Autosize}
      >
        <AttendanceDetail uid={selectedAttendance} />
      </Modal>
    </Table.Tbody>
  );
};

export default TableItem;
