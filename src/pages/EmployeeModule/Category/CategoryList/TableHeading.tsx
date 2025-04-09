import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "5%" }}>Serial</Table.Th>
        <Table.Th style={{ width: "25%" }}>Name</Table.Th>
        <Table.Th style={{ width: "25%" }}>Values</Table.Th>
        <Table.Th style={{ width: "20%" }}>Model Type</Table.Th>
        <Table.Th style={{ width: "15%" }}>Created At</Table.Th>
        <Table.Th style={{ width: "5%" }}>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
