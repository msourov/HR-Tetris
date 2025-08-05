import { FC, useState } from "react";
import { Overtime } from "../../features/api/typesOld";
import { Accordion, Box, Button, Modal, ScrollArea, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import OvertimeReviewModal from "../EmployeeModule/Overtime/OvertimeList/ReviewModal";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";
import AppLoader from "../../components/ui/AppLoader";
import useFormatDate from "../../services/utils/useFormatDate";

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

  const { formatDate } = useFormatDate();

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
            {Array.isArray(data) ? (
              data.length ? (
                data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-full">
                        <Text fw={500}>{item.purpose}</Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="w-full bg-gray-100 border-x-2 border-green-400">
                      <Box className="flex justify-between items-start py-2">
                        <Box className="flex flex-col">
                          <Text>{item.employee_name}</Text>
                          <Text c="dimmed">{item.purpose}</Text>
                          <Text c="blue" mt={10} className="opacity-65">
                            {dayjs(item?.start_time).isSame(
                              dayjs(item?.end_time),
                              "day"
                            )
                              ? formatDate(item?.start_time)
                              : formatDate(item?.start_time)}{" "}
                            - {formatDate(item?.end_time)}
                          </Text>
                        </Box>
                        <Button
                          size="compact-sm"
                          color="green"
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
                  <AppLoader />
                </Box>
              ) : (
                <Text c="dimmed" my={10} ta="center">
                  No data available
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
