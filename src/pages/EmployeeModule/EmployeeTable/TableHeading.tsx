import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#212922] text-white">
      <Table.Tr>
        <Table.Th style={{ width: "15%" }}>Name</Table.Th>
        <Table.Th style={{ width: "10%" }}>Employee ID</Table.Th>
        <Table.Th style={{ width: "10%" }}>Phone Number</Table.Th>
        <Table.Th style={{ width: "15%" }}>Email</Table.Th>
        <Table.Th style={{ width: "10%" }}>Shift</Table.Th>
        <Table.Th style={{ width: "10%" }}>Department</Table.Th>
        <Table.Th style={{ width: "10%" }}>Designation</Table.Th>
        <Table.Th style={{ width: "5%" }}>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
