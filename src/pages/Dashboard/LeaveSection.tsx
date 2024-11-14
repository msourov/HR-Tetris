import { FC } from "react";
import { Leave } from "../../features/api/types";
import {
  Accordion,
  Box,
  Button,
  Divider,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

type LeaveSectionProps = {
  data: Leave | Leave[];
};

const LeaveSection: FC<LeaveSectionProps> = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-200 rounded-md w-full shadow-lg">
      <ScrollArea
        type="scroll"
        offsetScrollbars
        style={{ overflowY: "hidden" }}
      >
        <Box className="gap-4 flex flex-col items-center">
          <Text
            c="red"
            fw={700}
            size="lg"
            ta="center"
            mt={12}
            className="opacity-65"
          >
            Leave Requests
          </Text>
          <Divider color="red" w="70%" size="xs" />
          <Accordion transitionDuration={200} className="w-full mx-6">
            {Array.isArray(data)
              ? data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-1/2">
                        <Text lineClamp={1}>{item.purpose}</Text>
                      </Box>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Box>
                        <Text>{item.employee_name}</Text>
                        <Text>{item.purpose}</Text>
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
            my={6}
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
