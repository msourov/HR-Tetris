import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { User } from "../../../../features/api/typesOld";
import { useGetUsersQuery } from "../../../../features/api/userSlice";
import { useState } from "react";

const UserTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page,
    limit,
  });
  const users: User[] = data?.data || [];

  return (
    <>
      <Table striped highlightOnHover>
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
    </>
  );
};

export default UserTable;
