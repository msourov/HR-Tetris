import {
  Loader,
  Alert,
  Card,
  Group,
  Badge,
  Title,
  Stepper,
} from "@mantine/core";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUserDetailQuery } from "../../../../features/api/userSlice";
import { UserResponseData } from "../../../../features/types/user";
import { getImageUrl } from "../../../../services/utils/getImageUrl";

const UserDetail: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const { data, isLoading, error } = useGetUserDetailQuery(
    uid ? { uid } : skipToken
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/employee_avatar.png";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" variant="dots" />
      </div>
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
      <div key={index}>
        <p className="text-sm font-small text-blue-800 mb-1">
          {log?.admin || log?.user || "N/A"}
        </p>
        <p className="text-xs text-gray-500">{log?.message ?? "N/A"}</p>
        <p className="text-xs text-gray-500">
          <span className="font-bold">Created: </span>
          <span className="text-blue-500">
            {log?.create_at ? new Date(log.create_at).toLocaleString() : "N/A"}
          </span>
        </p>
      </div>
    ));

  console.log(user);

  return (
    <div className="flex flex-col justify-between md:flex-row p-6 lg:py-10 gap-8 rounded-lg shadow-sm max-w-6xl mx-auto">
      {/* Left Section: User Details */}
      <Card withBorder radius="md" className="w-full flex-1 md:w-1/3 bg-white">
        <Card.Section p="md" className="flex justify-center">
          <img
            src={getImageUrl(user?.mobile || "")}
            alt={user?.name}
            className="w-40 h-40 rounded-full mr-2 inline-block"
            onError={handleImageError}
          />
        </Card.Section>

        <Group mb="xs" className="mx-auto">
          <p className="font-medium text-lg text-center">{user?.name}</p>

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

        <div className="flex-1 bg-gray-100 py-4">
          <p className="text-sm text-gray-500 flex items-center gap-2 justify-center">
            <FaPhoneAlt />
            <span>{user?.mobile}</span>
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            {user?.role_name}
          </p>
        </div>
      </Card>

      {/* Right Section: Activity Logs */}
      <div
        className="bg-blue-50 w-[260px] rounded-lg border p-6 mx-auto"
        style={{ minHeight: "400px" }}
      >
        <Title order={4} mb="md" c="gray" ta="center">
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
          <p className="text-sm text-center text-gray-500">
            No activity logs available.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
