import {
  Box,
  Text,
  Loader,
  Alert,
  Card,
  Group,
  Badge,
  Avatar,
  Title,
  Stepper,
} from "@mantine/core";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUserDetailQuery } from "../../../../features/api/userSlice";

const UserDetail: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const { data, isLoading, error } = useGetUserDetailQuery(
    uid ? { uid } : skipToken
  );

  if (isLoading) return <Loader size="lg" />;
  if (error)
    return (
      <Alert title="Error" color="red">
        Error fetching user details
      </Alert>
    );

  const user = data?.data;

  console.log(user);

  const logsSteps = (Array.isArray(user?.logs) ? user.logs : [])
    .filter(Boolean)
    .map((log, index) => (
      <Stepper.Step
        key={index}
        label={log?.admin ?? "N/A"}
        description={log?.message ?? "N/A"}
      >
        <Text size="xs" color="dimmed">
          <Text fw="bold">Created:</Text>
          {log?.create_at ? new Date(log.create_at).toLocaleString() : "N/A"}
        </Text>
      </Stepper.Step>
    ));

  // const formatDate = (date: string | null | undefined) => {
  //   if (!date) return "N/A";
  //   return new Date(date).toLocaleString();
  // };
  return (
    <Box p="md" className="flex gap-[5%] justify-between">
      <Card padding="lg" withBorder className="w-[30%]" bg="#F0F4E3">
        <Card.Section p="md">
          <Avatar
            size={120}
            radius="xl"
            src={`https://avatar.iran.liara.run/public`}
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{user?.name}</Text>
          <Badge
            className={
              user?.active
                ? "bg-green-200 text-green-600"
                : "bg-red-200 text-red-600"
            }
          >
            {user?.active ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" className="flex items-center gap-2">
          <FaPhoneAlt />
          <Text span>{user?.mobile}</Text>
        </Text>

        {/* <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button> */}
      </Card>
      <Box>
        <Box className="shadow-xl p-8">
          <Title order={4} mb="md">
            Activity Logs
          </Title>
          <Stepper
            orientation="vertical"
            size="sm"
            active={logsSteps.length - 1}
          >
            {logsSteps}
          </Stepper>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetail;
