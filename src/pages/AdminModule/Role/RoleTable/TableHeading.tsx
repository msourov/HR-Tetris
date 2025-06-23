import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white">
      <Table.Th className="w-[25%] pl-4 lg:pl-6">Role</Table.Th>
      <Table.Th className="w-[40%]">Access</Table.Th>
      <Table.Th className="w-[15%]">Status</Table.Th>
      <Table.Th className="w-[20%] pr-4 lg:pr-6">Action</Table.Th>
    </Table.Thead>
  );
};

export default TableHeading;
