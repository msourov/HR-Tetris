import { FC } from "react";
import { Leave } from "../../features/api/types";
import { Accordion, Box, Button, ScrollArea, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type LeaveSectionProps = {
  data: Leave | Leave[];
};

const LeaveSection: FC<LeaveSectionProps> = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-md w-full shadow-lg">
      <ScrollArea type="scroll" style={{ overflowY: "hidden" }}>
        <Box className="flex flex-col items-center">
          <Box w="100%" className="bg-red-400 z-10">
            <Text fw={600} size="lg" ta="center" my={6} c="white">
              Leave Requests
            </Text>
          </Box>

          {/* <Divider color="red" w="70%" size="xs" mb={10} /> */}
          <Accordion transitionDuration={200} className="">
            {Array.isArray(data)
              ? data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-1/2">
                        <Text lineClamp={1}>{item.purpose}</Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel className="w-full">
                      <Box className="flex justify-between items-start">
                        <Box className="flex flex-col">
                          <Text>{item.employee_name}</Text>
                          <Text>{item.purpose}</Text>
                        </Box>
                        <Button
                          size="compact-sm"
                          color="blue"
                          variant="light"
                          className="flex-shrink-0 flex-grow-0"
                        >
                          Review
                        </Button>
                      </Box>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))
              : null}
          </Accordion>
          <Button
            variant="light"
            c="blue"
            size="sm"
            my={10}
            onClick={() => navigate("/leave")}
          >
            See more
          </Button>
        </Box>
      </ScrollArea>
    </div>
  );
};

export default LeaveSection;
