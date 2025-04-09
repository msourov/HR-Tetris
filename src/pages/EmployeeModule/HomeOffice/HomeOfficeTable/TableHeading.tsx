import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "6%" }}>Serial</Table.Th>
        <Table.Th style={{ width: "15%" }}>Employee Name</Table.Th>
        <Table.Th style={{ width: "8%" }}>Employee ID</Table.Th>
        <Table.Th style={{ width: "35%" }}>Purpose</Table.Th>
        <Table.Th style={{ width: "8%" }}>Start Date</Table.Th>
        <Table.Th style={{ width: "8%" }}>End Date</Table.Th>
        <Table.Th style={{ width: "10%" }}>Status</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
