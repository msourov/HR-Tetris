import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import { useGetAllTangiblesQuery } from "../../../../features/api/tangibleInventorySlice";
import { useEffect, useState } from "react";
import { Tangible } from "../../../../features/types/inventory";

const TangibleTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [toggleDateOrder, setToggleDateOrder] = useState<"asc" | "desc">(
    "desc"
  );
  const [togglePriceOrder, setTogglePriceOrder] = useState<"asc" | "desc">(
    "asc"
  );
  const [sortBy, setSortBy] = useState<"date" | "price">("date");
  const [sortedTangibles, setSortedTangibles] = useState<Tangible[]>([]);

  const { data, isLoading, error } = useGetAllTangiblesQuery({
    page,
    limit,
  });

  const handleDateOrderChange = () => {
    setSortBy("date");
    setToggleDateOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleChangePriceOrder = () => {
    setSortBy("price");
    setTogglePriceOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    if (data?.data) {
      const sortedData = [...data.data];

      if (sortBy === "date") {
        sortedData.sort((a, b) => {
          const dateA = new Date(a.create_at).getTime();
          const dateB = new Date(b.create_at).getTime();
          return toggleDateOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
      } else if (sortBy === "price") {
        sortedData.sort((a, b) =>
          togglePriceOrder === "asc" ? a.price - b.price : b.price - a.price
        );
      }

      setSortedTangibles(sortedData);
    }
  }, [data, sortBy, toggleDateOrder, togglePriceOrder]);

  return (
    <>
      <Table striped highlightOnHover>
        <TableHeading
          changeDateOrder={handleDateOrderChange}
          changePriceOrder={handleChangePriceOrder}
        />
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
