import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white">
      <Table.Th className="w-[20%] pl-4 lg:pl-8">Role</Table.Th>
      <Table.Th className="w-[40%]">Access</Table.Th>
      <Table.Th className="w-[10%]">Status</Table.Th>
      <Table.Th className="w-[10%] pr-4 lg:pr-8">Action</Table.Th>
    </Table.Thead>
  );
};

export default TableHeading;
