import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-amber-400">
      <Table.Tr>
        <Table.Th style={{ width: "5%" }}>Index</Table.Th>
        <Table.Th style={{ width: "20%" }}>Employee ID</Table.Th>
        <Table.Th style={{ width: "20%" }}>Purpose</Table.Th>
        <Table.Th style={{ width: "20%" }}>Start Time</Table.Th>
        <Table.Th style={{ width: "20%" }}>End Time</Table.Th>
        <Table.Th style={{ width: "20%" }}>Approval Status</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
