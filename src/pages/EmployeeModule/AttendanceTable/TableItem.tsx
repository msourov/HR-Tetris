import { Modal, Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import CommonSkeleton from "../../../components/shared/CommonSkeleton";
import { Attendance } from "../../../features/types/attendance";
import useFormatDate from "../../../services/utils/useFormatDate";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import AttendanceDetail from "./AttendanceDetail";

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
  const [src, setSrc] = useState("");
  const [url, setUrl] = useState("");
  const { formatDate } = useFormatDate();

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setSrc(""); // Clear previous image

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        if (isMounted) {
          setSrc(URL.createObjectURL(blob));
        }
      })
      .catch((err) => console.error("Error fetching image:", err));

    return () => {
      isMounted = false;
      if (src) URL.revokeObjectURL(src);
    };
  }, [url]);

  const handleAttendanceOpen = async (uid: string) => {
    setSelectedAttendance(uid);
    open();
  };

  useEffect(() => {
    if (data.length > 0) {
      setUrl(data[0]?.employee_image || "");
    }
  }, [data]);

  if (isLoading) {
    return <CommonSkeleton cols={7} rows={5} />;
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
          <Table.Td className="w-[15%] border border-blue-300 bg-blue-100">
            <img
              src={item.employee_image}
              alt={item.employee_name}
              className="w-10 h-10 rounded-full mr-2 inline-block"
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")} // Fallback image
            />
            {item.employee_name}
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
