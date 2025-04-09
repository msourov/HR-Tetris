import { Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetAllTangiblesQuery } from "../../../../features/api/tangibleInventorySlice";

const TangibleTable = () => {
  const { data, isLoading, error } = useGetAllTangiblesQuery({
    page: 1,
    limit: 10,
  });
  const { logout } = useAuth();

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }
  console.log(data);
  return (
    <>
      <Table>
        <TableHeading />
        <TableItem data={data?.data || []} isLoading={isLoading} error={error} />
      </Table>
    </>
  );
};

export default TangibleTable;
