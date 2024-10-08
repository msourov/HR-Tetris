import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-amber-400">
      <Table.Th style={{ width: "10%" }}>Serial</Table.Th>
      <Table.Th style={{ width: "20%" }}>Name</Table.Th>
      <Table.Th style={{ width: "30%" }}>Access</Table.Th>
      <Table.Th style={{ width: "10%" }}>Status</Table.Th>
      <Table.Th style={{ width: "5%" }}>Action</Table.Th>
    </Table.Thead>
  );
};

export default TableHeading;
