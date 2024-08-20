import {
  Card,
  Text,
  Badge,
  Button,
  Modal,
  Group,
  Box,
  SimpleGrid,
} from "@mantine/core";
import { useState } from "react";
import { useGetPoliciesQuery } from "../../../../features/api/policySlice";

const PolicyList = () => {
  const [opened, setOpened] = useState(false);
  const { data: policies } = useGetPoliciesQuery({ page: 1, limit: 100 });
  console.log(policies);
  return (
    <Box className="mt-6">
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {policies?.data.map((item) => (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" style={{ marginBottom: 5 }}>
              <Text fw={500}>{item.name}</Text>
              <Badge color={item.active ? "green" : "red"}>
                {item.active ? "Active" : "Inactive"}
              </Badge>
            </Group>

            <Text size="sm" style={{ lineHeight: 1.5 }}>
              {item.descriptions.length > 100
                ? `${item.descriptions.substring(0, 100)}...`
                : item.descriptions}
            </Text>

            <Text size="xs" color="dimmed">
              Created on: {new Date(item.create_at).toLocaleDateString()}
            </Text>

            <Button
              size="xs"
              onClick={() => setOpened(true)}
              style={{ marginTop: 10 }}
            >
              See More
            </Button>
          </Card>
        ))}

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={policies?.data[0]?.name}
        >
          <Text>{policies?.data[0]?.descriptions}</Text>

          <Text size="sm" style={{ marginTop: 10 }}>
            Logs:
          </Text>
          {/* <Text size="xs" color="dimmed">
          {policies?.data.logs.message} - {policies?.data.logs.admin} on{" "}
          {policies?.data.logs.create_at}
        </Text> */}
        </Modal>
      </SimpleGrid>
    </Box>
  );
};

export default PolicyList;
