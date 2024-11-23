import { FC } from "react";
import { Overtime } from "../../features/api/types";
import { Accordion, Box, Button, ScrollArea, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type OvertimeSectionProps = {
  data: Overtime | Overtime[];
};

const OvertimeSection: FC<OvertimeSectionProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md w-full shadow-lg">
      <ScrollArea type="scroll" style={{ overflowY: "hidden" }}>
        <Box className="flex flex-col items-center">
          <Box w="100%" className="bg-green-600">
            <Text fw={600} size="lg" ta="center" my={6} c="white">
              Overtime Requests
            </Text>
          </Box>
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
            my={10}
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