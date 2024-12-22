import { FC, useState } from "react";
import { Leave } from "../../features/api/typesOld";
import {
  Accordion,
  Box,
  Button,
  Loader,
  Modal,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import LeaveReviewModal from "../EmployeeModule/Leave/LeaveList/ReviewModal";
import { useDisclosure } from "@mantine/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type LeaveSectionProps = {
  data: Leave | Leave[];
  loading: boolean;
  error: FetchBaseQueryError;
};

const LeaveSection: FC<LeaveSectionProps> = ({ data, loading, error }) => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [uid, setUid] = useState("");
  const [empId, setEmpId] = useState("");

  const handleModalOpen = (employee_id: string, uid: string) => {
    open();
    setEmpId(employee_id);
    setUid(uid);
  };

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <div className="rounded-md w-full shadow-lg">
      <ScrollArea type="scroll" style={{ overflowY: "hidden" }}>
        <Box className="flex flex-col items-center">
          <Box w="100%" className="bg-red-100 text-red-800 z-10">
            <Text fw={600} size="lg" ta="center" my={6}>
              Leave Requests
            </Text>
          </Box>

          {/* <Divider color="red" w="70%" size="xs" mb={10} /> */}
          <Accordion transitionDuration={200} className="">
            {Array.isArray(data) ? (
              data.length ? (
                data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-1/2">
                        <Text lineClamp={1}>{item.purpose}</Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="w-full bg-gray-50 border-x-2 border-red-400">
                      <Box className="flex justify-between items-start py-2">
                        <Box className="flex flex-col">
                          <Text>{item.employee_name}</Text>
                          <Text c="dimmed">{item.purpose}</Text>
                          <Text c="blue" mt={10} className="opacity-65">
                            {new Date(
                              item?.leave_start_date
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              item?.leave_end_date
                            ).toLocaleDateString()}
                          </Text>
                        </Box>
                        <Button
                          size="compact-sm"
                          color="blue"
                          variant="light"
                          className="flex-shrink-0 flex-grow-0 ml-2"
                          onClick={() =>
                            handleModalOpen(item?.employee_id, item?.uid)
                          }
                        >
                          Review
                        </Button>
                      </Box>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))
              ) : loading ? (
                <Box className="flex justify-center items-center">
                  <Loader type="dots" color="orange" size="sm" />
                </Box>
              ) : (
                <Text c="dimmed" my={10}>
                  No data available
                </Text>
              )
            ) : null}
          </Accordion>
          <Button
            variant="outline"
            c="blue"
            size="sm"
            my={10}
            onClick={() => navigate("/leave")}
          >
            See more
          </Button>
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
