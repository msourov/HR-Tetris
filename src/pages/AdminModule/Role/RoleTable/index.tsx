import { Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import { Role } from "../../../../features/api/typesOld";
import TableItem from "./TableItem";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";

const RoleTable: React.FC = () => {
  const { data, isLoading, error } = useGetRolesQuery({ page: 1, limit: 10 });
  const { logout } = useAuth();
  const roles: Role[] = data?.data || [];

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }

  return (
    <div>
      <Table>
        <TableHeading />
        <TableItem data={roles} loading={isLoading} />
      </Table>
    </div>
  );
};

export default RoleTable;
