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
import LeaveReviewModal from "../EmployeeModule/Leave/LeaveList/ReviewModal";
import { useDisclosure } from "@mantine/hooks";
import AppLoader from "../../components/ui/AppLoader";
import { useAllLeaveQuery } from "../../features/api/leaveSlice";
import { Leave } from "../../features/types/leave";
import { IconCalendar, IconUser } from "@tabler/icons-react";

// type LeaveSectionProps = {
//   data: Leave | Leave[];
//   loading: boolean;
//   error: FetchBaseQueryError;
// };

const LeaveSection = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [uid, setUid] = useState("");
  const [empId, setEmpId] = useState("");
  const {
    data,
    isLoading,
    error,
    // refetch: leaveRefetch,
  } = useAllLeaveQuery({
    page: 1,
    limit: 10,
  });

  const pendingLeaves = Array.isArray(data?.data)
    ? data.data.filter((item: Leave) => item.is_approved === "pending")
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
    <div className="w-full rounded-lg shadow-sm border border-gray-200">
      <ScrollArea type="scroll" style={{ overflowY: "hidden" }}>
        <Box className="flex flex-col items-center">
          <Box w="100%" className="bg-red-600 text-white rounded-t-lg py-2">
            <Text fw={600} size="md" ta="center">
              Leave Requests
            </Text>
          </Box>

          {/* <Divider color="red" w="70%" size="xs" mb={10} /> */}
          <Accordion transitionDuration={200} className="w-full py-1">
            {Array.isArray(pendingLeaves) ? (
              pendingLeaves.length ? (
                pendingLeaves.map((item, index) => (
                  <Accordion.Item
                    key={item?.uid}
                    value={`${index}-${item.purpose}`}
                  >
                    <Accordion.Control>
                      <Box className="w-full">
                        <Text lineClamp={1} fw={500}>
                          {item.purpose}
                        </Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="py-2 border-x-2 border-[#8d8d4f] bg-gray-100">
                      {/* Employee Name */}
                      <Group mb="sm" gap="xs">
                        <IconUser size={16} className="text-gray-500" />
                        <Text size="sm" c="dimmed">
                          {item.employee_name}
                        </Text>
                      </Group>

                      {/* Leave Dates */}
                      <Group mb="sm" gap="xs">
                        <IconCalendar size={16} className="text-gray-500" />
                        <Text size="sm" c="dimmed">
                          {new Date(item.leave_start_date).toLocaleDateString()}{" "}
                          – {new Date(item.leave_end_date).toLocaleDateString()}
                        </Text>
                      </Group>

                      {/* Purpose */}
                      <Text
                        size="sm"
                        className="bg-gray-50 p-3 max-h-[220px] overflow-y-auto scrollbar-custom border rounded"
                      >
                        {item.purpose}
                      </Text>

                      {/* Review Button */}
                      <Group justify="flex-end" mt="md">
                        <Button
                          size="xs"
                          variant="light"
                          color="orange"
                          onClick={() =>
                            handleModalOpen(item.employee_id, item.uid)
                          }
                        >
                          Review
                        </Button>
                      </Group>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))
              ) : isLoading ? (
                <Box className="flex justify-center items-center">
                  <AppLoader />
                </Box>
              ) : (
                <Text c="dimmed" ta="center" my={10}>
                  No pending data found
                </Text>
              )
            ) : null}
          </Accordion>

          <Box className="flex justify-center pb-2">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => navigate("/leave")}
            >
              View All Leaves
            </Button>
          </Box>
        </Box>
      </ScrollArea>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title={
          <Text c="dimmed">
            Reviewing Leave Request of{" "}
            <span className="text-blue-500 font-bold">{empId}</span>
          </Text>
        }
      >
        <LeaveReviewModal close={close} uid={uid} />
      </Modal>
    </div>
  );
};

export default LeaveSection;
