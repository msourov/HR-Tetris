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
import { UserResponseData } from "../../../../features/types/user";

const UserDetail: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const { data, isLoading, error } = useGetUserDetailQuery(
    uid ? { uid } : skipToken
  );

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Loader size="lg" variant="dots" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert title="Error" color="red" className="max-w-md mx-auto">
        Error fetching user details
      </Alert>
    );
  }

  const user: UserResponseData | undefined = data?.data[0];

  const logsSteps = (Array.isArray(user?.logs) ? user.logs : [])
    .filter(Boolean)
    .map((log, index) => (
      <Stepper.Step
        key={index}
        label={<Text size="sm">{log?.admin ?? "N/A"}</Text>}
        description={<Text size="xs">{log?.message ?? "N/A"}</Text>}
      >
        <Text size="xs" color="dimmed">
          <Text fw="bold" color="gray.7">
            Created:{" "}
            <Text span color="blue">
              {log?.create_at
                ? new Date(log.create_at).toLocaleString()
                : "N/A"}
            </Text>
          </Text>
        </Text>
      </Stepper.Step>
    ));

  console.log(user);

  return (
    <Box className="flex flex-col justify-between md:flex-row p-6 lg:py-10 gap-8 rounded-lg shadow-sm max-w-6xl mx-auto">
      {/* Left Section: User Details */}
      <Card withBorder radius="md" className="w-full flex-1 md:w-1/3 bg-white">
        <Card.Section p="md" className="flex justify-center">
          <Avatar
            size={120}
            radius="xl"
            src={`https://avatar.iran.liara.run/public`}
          />
        </Card.Section>

        <Group mb="xs" className="mx-auto">
          <Text fw={500} size="lg" ta="center">
            {user?.name}
          </Text>
          <Badge
            className={`${
              user?.active
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {user?.active ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <Box className="flex-1 bg-gray-100 py-4">
          <Text
            size="sm"
            c="dimmed"
            className="flex items-center gap-2 justify-center"
          >
            <FaPhoneAlt />
            <Text span>{user?.mobile}</Text>
          </Text>
          <Text size="xs" ta="center" color="dimmed" mt="xs">
            {user?.role_name}
          </Text>
        </Box>
      </Card>

      {/* Right Section: Activity Logs */}
      <Box
        className="bg-blue-50 w-[260px] rounded-lg border p-6 mx-auto"
        style={{ minHeight: "400px" }}
      >
        <Title order={4} mb="md" c="blue" ta="center">
          Activity Logs
        </Title>
        {logsSteps.length > 0 ? (
          <Stepper
            orientation="vertical"
            size="xs"
            active={logsSteps.length - 1}
            styles={{
              stepIcon: { fontSize: "12px" },
              step: { marginBottom: "1rem" },
              stepBody: { paddingLeft: "0.5rem" },
            }}
          >
            {logsSteps}
          </Stepper>
        ) : (
          <Text color="dimmed" size="sm" ta="center">
            No activity logs available.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default UserDetail;
