import { Pagination, Table } from "@mantine/core";
import { useGetAllHomeOfficesQuery } from "../../../../features/api/homeOfficeSlice";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";

const HomeOfficeTable = () => {
  const { data, isLoading, error } = useGetAllHomeOfficesQuery({
    page: 1,
    limit: 10,
  });

  const HomeOfficeData = data?.data
    ? Array.isArray(data.data)
      ? data.data
      : [data.data]
    : [];

  return (
    <>
      <Table>
        <TableHeading />
        <TableItem
          data={HomeOfficeData || []}
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

export default HomeOfficeTable;
