import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "5%" }}>Serial</Table.Th>
        <Table.Th style={{ width: "20%" }}>Name</Table.Th>
        <Table.Th style={{ width: "25%" }}>Certification Type</Table.Th>
        <Table.Th style={{ width: "25%" }}>Purpose</Table.Th>
        <Table.Th style={{ width: "10%" }}>Apply Date</Table.Th>
        <Table.Th style={{ width: "10%" }}>Status</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
