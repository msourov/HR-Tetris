import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetUsersQuery } from "../../../../features/api/userSlice";
import { useState } from "react";
import { User } from "../../../../features/types/user";

const UserTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page,
    limit,
  });
  const users: User[] = data?.data || [];
  return (
    <div className="bg-white">
      <Table striped highlightOnHover withTableBorder>
        <TableHeading />
        <TableItem
          page={data?.pagination?.page ?? 1}
          limit={data?.pagination?.page_size ?? 10}
          data={users}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination
          total={data?.pagination?.total_pages ?? 0}
          value={page}
          onChange={setPage}
          color="blue"
          disabled={isFetching}
        />
      </div>
    </div>
  );
};

export default UserTable;
