import { useGetAllCategoriesQuery } from "../../../../features/api/categorySlice";
import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import AddCategoryRow from "../AddCategory/AddCategoryRow";
import { useState } from "react";
import NoDataMessage from "../../../../components/ui/NoDataMessage";

const CategoryList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, error, refetch } =
    useGetAllCategoriesQuery({
      page,
      limit,
    });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <AddCategoryRow />
      </div>
      {data && Array.isArray(data?.data) && data?.data.length > 0 ? (
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
              total={data?.pagination?.total_pages ?? 0}
              value={page}
              onChange={setPage}
              color="rgb(33, 41, 34)"
              disabled={isFetching}
            />
          </div>
        </>
      ) : (
        <NoDataMessage message="data" onRefresh={refetch} loading={isFetching}/>
      )}
    </>
  );
};

export default CategoryList;
