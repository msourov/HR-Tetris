import { Box, Text, Title, Divider, Loader, Alert } from "@mantine/core";
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

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return date.toLocaleString();
  };

  return (
    <Box p="md">
      <Title order={2} mb="md">
        User Details
      </Title>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Name: {user?.name}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Mobile: {user?.mobile}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Role ID: {user?.role_id}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Super Admin: {user?.super_admin ? "Yes" : "No"}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Active: {user?.active ? "Yes" : "No"}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Logs:</Text>
        <Text>{user?.logs.admin}</Text>
        <Text>{user?.logs.message}</Text>
        <Text>Created At: {formatDate(user?.logs?.create_at)}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Created At:</Text>
        <Text>{formatDate(user?.create_at)}</Text>
      </Box>
      <Divider my="sm" />
      <Box mb="sm">
        <Text w={500}>Updated At:</Text>
        <Text>
          {user?.update_at ? new Date(user.update_at).toLocaleString() : "N/A"}
        </Text>
      </Box>
    </Box>
  );
};

export default UserDetail;
