import {Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";
import TableItem from "./TableItem";
import TableHeading from "./TableHeading";
import { useGetAllOvertimeQuery } from "../../../../features/api/overtimeSlice";

const OvertimeTable: React.FC = () => {
  const { data, error, isLoading } = useGetAllOvertimeQuery({
    page: 1,
    limit: 10,
  });
  const { logout } = useAuth();
  const overtimeData = Array.isArray(data?.data)
    ? data.data
    : data
    ? [data.data]
    : [];

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }

  return (
    <>
      <Table>
        <TableHeading />
        <TableItem data={overtimeData} isLoading={isLoading} error={error} />
      </Table>
    </>
  );
};

export default OvertimeTable;
