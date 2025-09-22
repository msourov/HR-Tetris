import { Pagination, Select, Table, TextInput } from "@mantine/core";
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
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

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

  // useEffect(() => {
  //   const filteredData =
  //     employees?.data?.filter((emp) => {
  //       const matchedShift = selectedShift
  //         ? emp.work.shift_and_schedule?.name.split(" ")[0].toLowerCase() ===
  //           selectedShift
  //         : true;

  //       return matchedShift;
  //     }) ?? [];
  //   setData(filteredData || employees?.data);
  // }, [selectedShift]);

  const paginatedData = employees?.data;

  return (
    <div className="space-y-2 w-full">
      <div className="mb-6 flex justify-start gap-4">
        <div className="w-[50%]">
          <TextInput
            label={
              <p className="text-gray-500">
                Search employees by Name, EID, Phone or Email
              </p>
            }
            placeholder="Enter text to search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value);
              setPage(1);
            }}
            rightSection={<IconSearch />}
            className="w-full h-[10]"
          />
        </div>

        <div className="w-[30%]">
          <Select
            label={<p className="text-gray-500">Filter by Shift</p>}
            placeholder="All Shifts"
            value={selectedShift}
            onChange={(value) => {
              setSelectedShift(value);
              setPage(1);
            }}
            data={[
              { value: "morning", label: "Morning" },
              { value: "evening", label: "Evening" },
              { value: "day", label: "Day" },
            ]}
            clearable
            className="w-[200px]"
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <Table striped highlightOnHover withTableBorder withRowBorders>
          <TableHeading /> 
          <TableItem
            page={employees?.pagination?.page ?? 1}
            limit={employees?.pagination?.page_size ?? 10}
            data={paginatedData || []}
            isLoading={isLoading || isFetching}
            error={error}
          />
        </Table>
      </div>

      {employees?.pagination?.total_pages != 0 && (
        <div className="px-4 pt-8 pb-4 float-right">
          <Pagination
            total={employees?.pagination?.total_pages ?? 0}
            value={page}
            onChange={setPage}
            color="blue"
            disabled={isFetching}
          />
        </div>
      )}
    </div>
  );
};

export default EmplyeeTable;
