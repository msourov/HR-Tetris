import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetAllConsumablesQuery } from "../../../../features/api/consumableInventorySlice";
import { useState } from "react";

const ConsumableTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetAllConsumablesQuery({
    page,
    limit,
  });

  return (
    <>
      <Table>
        <TableHeading />
        <TableItem
          page={data?.pagination?.page ?? 1}
          limit={data?.pagination?.page_size ?? 10}
          data={data?.data || []}
          isLoading={isLoading}
          error={error}
        />
      </Table>
      <div className="px-4 pt-8 pb-4 float-right">
        <Pagination
          value={data?.pagination.page ?? 1}
          total={data?.pagination.total_pages ?? 1}
          siblings={1}
          boundaries={1}
          color="blue"
          onChange={setPage}
        />
      </div>
    </>
  );
};

export default ConsumableTable;
