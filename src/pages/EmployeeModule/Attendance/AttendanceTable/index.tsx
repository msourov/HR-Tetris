import { Pagination, Table, TextInput } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetAllAttendanceQuery } from "../../../../features/api/attendanceSlice";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
// import AppPageHeader from "../../../components/core/AppPageHeader";

const AttendanceTable = () => {
  const [searchParams, setSearchParams] = useState({
    employee_name: "",
    attended_date: "",
    start_date: "",
    end_date: "",
  });

  const {
    data: attendance,
    isLoading,
    error,
  } = useGetAllAttendanceQuery(searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger new search with current params
    setSearchParams({ ...searchParams });
  };
  return (
    <>
      <div className="mb-4 rounded-lg">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <TextInput
            label={<p className="text-gray-500">Search employees by Name</p>}
            placeholder="Enter Name"
            value={searchParams.employee_name}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                employee_name: e.target.value,
              })
            }
          />
          {/* <DateInput
            placeholder="Attended Date"
            value={searchParams.attended_date ? new Date(searchParams.attended_date) : null}
            onChange={(date) => setSearchParams({...searchParams, attended_date: date ? date.toISOString() : ''})}
          /> */}
          <DateInput
            label={<p className="text-gray-500">Start Date</p>}
            placeholder="Enter Start Date"
            value={
              searchParams.start_date ? new Date(searchParams.start_date) : null
            }
            onChange={(date) =>
              setSearchParams({
                ...searchParams,
                start_date: date ? date.toISOString() : "",
              })
            }
          />
          <DateInput
            label={<p className="text-gray-500">End Date</p>}
            placeholder="Enter End Date"
            value={
              searchParams.end_date ? new Date(searchParams.end_date) : null
            }
            onChange={(date) =>
              setSearchParams({
                ...searchParams,
                end_date: date ? date.toISOString() : "",
              })
            }
          />
          {/* <Button type="submit" className="md:col-span-4">
            Search
          </Button> */}
        </form>
      </div>
      <Table striped highlightOnHover>
        <TableHeading />
        <TableItem
          data={attendance?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination total={4} color="rgb(33, 41, 34)" />
      </div>
    </>
  );
};

export default AttendanceTable;
