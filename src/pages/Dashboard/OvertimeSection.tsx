import { useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Group,
  Modal,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import OvertimeReviewModal from "../EmployeeModule/Overtime/OvertimeList/ReviewModal";
import dayjs from "dayjs";
import AppLoader from "../../components/ui/AppLoader";
import useFormatDate from "../../services/utils/useFormatDate";
import { IconCalendar, IconUser } from "@tabler/icons-react";
import { useGetAllOvertimeQuery } from "../../features/api/overtimeSlice";
import { Overtime } from "../../features/types/overtime";

// type OvertimeSectionProps = {
//   data: Overtime | Overtime[];
//   loading: boolean;
//   error: FetchBaseQueryError;
// };

const OvertimeSection = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [uid, setUid] = useState("");
  const [empId, setEmpId] = useState("");

  const { formatDate } = useFormatDate();
  const { data, isLoading, error } = useGetAllOvertimeQuery({
    page: 1,
    limit: 10,
  });

  const pendingOvertime = Array.isArray(data?.data)
    ? data.data
        .filter((item: Overtime) => item.is_approved === "pending")
        .slice(0, 5)
    : data?.data.is_approved === "pending"
    ? data?.data
    : [];

  const handleModalOpen = (employee_id: string, uid: string) => {
    open();
    setEmpId(employee_id);
    setUid(uid);
  };

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm">
      <Box className="bg-green-600 text-white rounded-t-lg py-2">
        <Text fw={600} size="md" ta="center">
          Overtime Requests
        </Text>
      </Box>
      <ScrollArea.Autosize mah={400} type="scroll">
        <Box className="flex flex-col items-center">
          <Accordion transitionDuration={200} className="w-full py-1">
            {Array.isArray(pendingOvertime) ? (
              pendingOvertime.length ? (
                pendingOvertime.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-full">
                        <Text lineClamp={1} fw={500}>
                          {item.purpose}
                        </Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="w-full py-2 bg-gray-100 border-x-2 border-green-400">
                      {/* <Box className="flex justify-between items-start py-2"> */}
                      <Box className="flex flex-col">
                        <Group mb="sm" gap="xs">
                          <IconUser size={16} className="text-gray-500" />
                          <Text size="sm" c="dimmed">
                            {item.employee_name}
                          </Text>
                        </Group>
                        <Group mb="sm" gap="xs">
                          <IconCalendar size={16} className="text-gray-500" />
                          <Text c="blue" className="opacity-65">
                            {dayjs(item?.start_time).isSame(
                              dayjs(item?.end_time),
                              "day"
                            )
                              ? formatDate(item?.start_time)
                              : formatDate(item?.start_time)}{" "}
                            - {formatDate(item?.end_time)}
                          </Text>
                        </Group>
                        <Text
                          size="sm"
                          className="bg-gray-50 p-2 max-h-[220px] overflow-y-auto scrollbar-custom border rounded"
                        >
                          {item.purpose}
                        </Text>
                      </Box>
                      <Group justify="flex-end" mt="md">
                        <Button
                          size="compact-sm"
                          color="orange"
                          variant="light"
                          className="flex-shrink-0 flex-grow-0"
                          onClick={() =>
                            handleModalOpen(item?.employee_id, item?.uid)
                          }
                        >
                          Review
                        </Button>
                      </Group>

                      {/* </Box> */}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))
              ) : isLoading ? (
                <Box className="flex justify-center items-center">
                  <AppLoader />
                </Box>
              ) : (
                <Text c="dimmed" my={10} ta="center">
                  No pending data found
                </Text>
              )
            ) : null}
          </Accordion>
          <Button
            variant="subtle"
            size="sm"
            my={10}
            onClick={() => navigate("/overtime")}
          >
            View All Overtimes
          </Button>
        </Box>
      </ScrollArea.Autosize>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title={
          <Text c="dimmed">
            Reviewing overtime Request of{" "}
            <span className="text-blue-500 font-bold">{empId}</span>
          </Text>
        }
      >
        <OvertimeReviewModal close={close} uid={uid} />
      </Modal>
    </div>
  );
};

export default OvertimeSection;
