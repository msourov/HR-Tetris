import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "5%", paddingLeft: "16px" }}>Serial</Table.Th>
        <Table.Th style={{ width: "20%" }}>Employee</Table.Th>
        <Table.Th style={{ width: "10%" }}>EID</Table.Th>
        <Table.Th style={{ width: "10%" }}>Status</Table.Th>
        <Table.Th style={{ width: "15%" }}>Start Date</Table.Th>
        <Table.Th style={{ width: "15%" }}>End Time</Table.Th>
        <Table.Th style={{ width: "10%", paddingRight: "16px" }}>
          Work Mode
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
