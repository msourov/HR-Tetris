import { Pagination, Table } from "@mantine/core";
import { useGetAllHomeOfficesQuery } from "../../../../features/api/homeOfficeSlice";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useState } from "react";
import NoDataMessage from "../../../../components/ui/NoDataMessage";

const HomeOfficeTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch, isFetching } =
    useGetAllHomeOfficesQuery({
      page,
      limit,
    });

  const HomeOfficeData = data?.data
    ? Array.isArray(data.data)
      ? data.data
      : [data.data]
    : [];

  return (
    <>
      {HomeOfficeData?.length > 0 ? (
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
            <Pagination
              value={data?.pagination.page ?? 1}
              total={data?.pagination.total_pages ?? 1}
              siblings={1}
              boundaries={1}
              color="blue"
              onChange={setPage}
              disabled={isFetching}
            />
          </div>
        </>
      ) : (
        <NoDataMessage
          message="Data"
          onRefresh={refetch}
          loading={isFetching}
        />
      )}
    </>
  );
};

export default HomeOfficeTable;
