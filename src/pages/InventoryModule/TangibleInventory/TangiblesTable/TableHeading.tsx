import { Table } from "@mantine/core";
import { IconArrowsDownUp } from "@tabler/icons-react";

const TableHeading = ({
  changeDateOrder,
  changePriceOrder,
}: {
  changeDateOrder: () => void;
  changePriceOrder: () => void;
}) => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "5%" }}>Serial</Table.Th>
        <Table.Th style={{ width: "10%" }}>Name</Table.Th>
        <Table.Th style={{ width: "20%" }}>Description</Table.Th>
        <Table.Th style={{ width: "5%" }}>Quantity</Table.Th>
        <Table.Th style={{ width: "5%" }}>
          <div className="flex items-center gap-1">
            <button onClick={changePriceOrder}>
              <IconArrowsDownUp size={15} />
            </button>
            <span>Price</span>
          </div>
        </Table.Th>
        <Table.Th style={{ width: "10%" }}>Location</Table.Th>
        <Table.Th style={{ width: "5%" }}>Category</Table.Th>
        <Table.Th style={{ width: "15%" }}>
          <div className="flex items-center gap-1">
            <button onClick={changeDateOrder}>
              <IconArrowsDownUp size={15} />
            </button>
            <span>Created At</span>
          </div>
        </Table.Th>
        <Table.Th style={{ width: "5%" }}>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
