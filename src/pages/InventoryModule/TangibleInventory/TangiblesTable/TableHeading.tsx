import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "5%" }}>Serial</Table.Th>
        <Table.Th style={{ width: "10%" }}>Name</Table.Th>
        <Table.Th style={{ width: "20%" }}>Description</Table.Th>
        <Table.Th style={{ width: "5%" }}>Quantity</Table.Th>
        <Table.Th style={{ width: "5%" }}>Price</Table.Th>
        <Table.Th style={{ width: "10%" }}>Location</Table.Th>
        <Table.Th style={{ width: "5%" }}>Category</Table.Th>
        <Table.Th style={{ width: "15%" }}>Created At</Table.Th>
        <Table.Th style={{ width: "5%" }}>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
