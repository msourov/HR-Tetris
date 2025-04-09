import { FC, useState } from "react";
import { Overtime } from "../../features/api/typesOld";
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
import { useDisclosure } from "@mantine/hooks";
import OvertimeReviewModal from "../EmployeeModule/Overtime/OvertimeList/ReviewModal";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";

type OvertimeSectionProps = {
  data: Overtime | Overtime[];
  loading: boolean;
  error: FetchBaseQueryError;
};

const OvertimeSection: FC<OvertimeSectionProps> = ({
  data,
  loading,
  error,
}) => {
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
          <Box w="100%" className="bg-green-100 text-green-800">
            <Text fw={600} size="lg" ta="center" my={6}>
              Overtime Requests
            </Text>
          </Box>
          <Accordion transitionDuration={200} className="w-full mx-6">
            {Array.isArray(data) ? (
              data.length ? (
                data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-full">
                        <Text>{item.purpose}</Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="w-full bg-gray-50 border-x-2 border-green-400">
                      <Box className="flex justify-between items-start py-2">
                        <Box className="flex flex-col">
                          <Text>{item.employee_name}</Text>
                          <Text c="dimmed">{item.purpose}</Text>
                          <Text c="blue" mt={10} className="opacity-65">
                            {dayjs(item?.start_time).isSame(
                              dayjs(item?.end_time),
                              "day"
                            )
                              ? dayjs(item?.start_time).format("DD/MM/YYYY")
                              : dayjs(item?.start_time).format(
                                  "DD/MM/YYYY"
                                )}{" "}
                            - {dayjs(item?.end_time).format("DD/MM/YYYY")}
                            {/* {new Date(item?.start_time).toLocaleDateString()} -{" "}
                            {new Date(item?.end_time).toLocaleDateString()} */}
                          </Text>
                        </Box>
                        <Button
                          size="compact-sm"
                          color="blue"
                          variant="light"
                          className="flex-shrink-0 flex-grow-0 ml-6"
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
            onClick={() => navigate("/overtime")}
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
