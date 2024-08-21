import { Box, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { User } from "../../../../features/api/types";
import { useGetUsersQuery } from "../../../../features/api/userSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";

const UserTable = () => {
  const { data, isLoading, error } = useGetUsersQuery({ page: 1, limit: 10 });
  const { logout } = useAuth();
  const users: User[] = data?.data || [];
  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }
  console.log("error in usertable", typeof error, error);
  return (
    <Box>
      <Table>
        <TableHeading />
        <TableItem data={users} isLoading={isLoading} error={error} />
      </Table>
    </Box>
  );
};

export default UserTable;
