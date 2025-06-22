import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetAllTangiblesQuery } from "../../../../features/api/tangibleInventorySlice";
import { useEffect, useState } from "react";
import { Tangible } from "../../../../features/types/inventory";

const TangibleTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [toggleDateOrder, setToggleDateOrder] = useState<"asc" | "desc">("asc");
  const [sortedTangibles, setSortedTangibles] = useState<Tangible[]>([]);

  const { data, isLoading, error } = useGetAllTangiblesQuery({
    page,
    limit,
  });

  const handleDateOrderChange = () => {
    setToggleDateOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    if (data?.data) {
      const sortedData = [...data.data].sort((a, b) => {
        const dateA = new Date(a.create_at).getTime();
        const dateB = new Date(b.create_at).getTime();
        return toggleDateOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
      setSortedTangibles(sortedData);
    }
  }, [toggleDateOrder, data]);

  console.log();

  return (
    <>
      <Table>
        <TableHeading changeDateOrder={handleDateOrderChange} />
        <TableItem data={sortedTangibles} isLoading={isLoading} error={error} />
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

export default TangibleTable;
