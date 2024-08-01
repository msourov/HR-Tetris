import { Box, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { User } from "../../../../features/api/types";
import { useGetUsersQuery } from "../../../../features/api/userSlice";

const UserTable = () => {
  const { data, isLoading, error } = useGetUsersQuery({ page: 1, limit: 10 });
  const users: User[] = data?.data || [];
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
