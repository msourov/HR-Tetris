import { FC } from "react";
import { Overtime } from "../../features/api/types";
import {
  Accordion,
  Box,
  Button,
  Divider,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

type OvertimeSectionProps = {
  data: Overtime | Overtime[];
};

const OvertimeSection: FC<OvertimeSectionProps> = ({ data }) => {
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
            c="green"
            fw={700}
            size="lg"
            ta="center"
            mt={12}
            className="opacity-65"
          >
            Overtime Requests
          </Text>
          <Divider color="green" w="70%" size="xs" />
          <Accordion transitionDuration={200} className="w-full mx-6">
            {Array.isArray(data)
              ? data.map((item, index) => (
                  <Accordion.Item key={index} value={item.purpose}>
                    <Accordion.Control>
                      <Box className="w-full">
                        <Text>{item.purpose}</Text>
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
            onClick={() => navigate("/overtime")}
          >
            See more
          </Button>
        </Box>
      </ScrollArea>
    </div>
  );
};

export default OvertimeSection;
