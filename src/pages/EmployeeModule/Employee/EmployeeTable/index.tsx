import { Pagination, Table, TextInput } from "@mantine/core";
import { useGetEmployeesQuery } from "../../../../features/api/employeeSlice";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

const EmplyeeTable = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 500);

  const limit = 10;

  const {
    data: employees,
    isLoading,
    isFetching,
    error,
  } = useGetEmployeesQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  return (
    <div className="space-y-4 w-full">
      <div className="my-8 w-[90%] mx-auto">
        <TextInput
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value);
            setPage(1);
          }}
          rightSection={<IconSearch />}
          className="w-full h-[10]"
        />
      </div>

      <Table verticalSpacing="sm">
        <TableHeading />
        <TableItem
          page={employees?.pagination?.page ?? 0}
          limit={employees?.pagination?.limit ?? 0}
          data={employees?.data || []}
          isLoading={isLoading || isFetching}
          error={error}
        />
      </Table>

      {employees?.pagination?.total_pages && (
        <div className="px-4 pt-8 pb-4 float-right">
          <Pagination
            total={employees.pagination.total_pages}
            value={page}
            onChange={setPage}
            color="rgb(33, 41, 34)"
            disabled={isFetching}
          />
        </div>
      )}
    </div>
  );
};

export default EmplyeeTable;
