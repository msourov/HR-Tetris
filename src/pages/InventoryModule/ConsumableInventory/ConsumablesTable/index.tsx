import { Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";
import TableItem from "./TableItem";
import { useGetAllConsumablesQuery } from "../../../../features/api/consumableInventorySlice";

const ConsumableTable = () => {
  const { data, isLoading, error } = useGetAllConsumablesQuery({
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
        <TableItem
          data={data?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
    </>
  );
};

export default ConsumableTable;
