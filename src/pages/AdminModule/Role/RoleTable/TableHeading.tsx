import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white">
      <Table.Th style={{ width: "10%", paddingLeft: "32px" }}>Serial</Table.Th>
      <Table.Th style={{ width: "10%" }}>Name</Table.Th>
      <Table.Th style={{ width: "40%" }}>Access</Table.Th>
      <Table.Th style={{ width: "10%" }}>Status</Table.Th>
      <Table.Th style={{ width: "5%", paddingRight: "32px" }}>Action</Table.Th>
    </Table.Thead>
  );
};

export default TableHeading;
