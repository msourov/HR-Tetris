import { Box, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import { Role } from "../../../../features/api/types";
import TableItem from "./TableItem";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";

const RoleTable: React.FC = () => {
  const { data } = useGetRolesQuery({ page: 1, limit: 10 });
  const roles: Role[] = data?.data || [];
  return (
    <Box>
      <Table>
        <TableHeading />
        <TableItem data={roles} />
      </Table>
    </Box>
  );
};

export default RoleTable;
