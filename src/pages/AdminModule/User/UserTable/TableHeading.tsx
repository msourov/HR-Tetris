import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-amber-400">
      <Table.Tr>
        <Table.Th style={{ width: "10%" }}>Serial</Table.Th>
        <Table.Th style={{ width: "25%" }}>Name</Table.Th>
        <Table.Th style={{ width: "25%" }}>Phone Number</Table.Th>
        <Table.Th style={{ width: "20%" }}>Role</Table.Th>
        <Table.Th style={{ width: "10%" }}>Status</Table.Th>
        <Table.Th style={{ width: "10%" }}>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
