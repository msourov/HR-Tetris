/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Accordion,
  Box,
  //   Button,
  //   Loader,
  //   Modal,
  ScrollArea,
  Text,
} from "@mantine/core";
// import { useNavigate } from "react-router-dom";
// import LeaveReviewModal from "../EmployeeModule/Leave/LeaveList/ReviewModal";
// import { useDisclosure } from "@mantine/hooks";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const NoticeSection = () => {
  return (
    <div className="w-full shadow-lg border border-teal-300">
      <ScrollArea type="scroll" style={{ overflowY: "hidden" }}>
        <Box className="flex flex-col items-center">
          <Box w="100%" className="bg-teal-100 text-teal-800">
            <Text fw={600} size="md" ta="center" my={6}>
              Announcement Requests
            </Text>
          </Box>
          <Accordion transitionDuration={200} className="w-full mx-6">
            {/* {Array.isArray(data) ? (
              data.length ? (
                data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-full">
                        <Text>{item.purpose}</Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="w-full bg-gray-50 border-x-2 border-teal-400">
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
                <Text c="dimmed" my={10} ta="center">
                  No data available
                </Text>
              )
            ) : null} */}
          </Accordion>
          {/* <Button
            variant="outline"
            c="blue"
            size="compact-sm"
            my={10}
            onClick={() => navigate("/overtime")}
          >
            See more
          </Button> */}
        </Box>
      </ScrollArea>
      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default NoticeSection;
