import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#f8f9fa] border-b border-gray-200">
      <Table.Tr>
        <Table.Th className="py-4 text-sm font-semibold text-gray-700">
          Serial
        </Table.Th>
        <Table.Th className="pl-6 py-4 text-sm font-semibold text-gray-700">
          Task
        </Table.Th>
        <Table.Th className="py-4 text-sm font-semibold text-gray-700">
          Assignees
        </Table.Th>
        <Table.Th className="py-4 text-sm font-semibold text-gray-700">
          Reporter
        </Table.Th>
        <Table.Th className="py-4 text-sm font-semibold text-gray-700">
          Priority
        </Table.Th>
        <Table.Th className="py-4 text-sm font-semibold text-gray-700">
          Status
        </Table.Th>
        <Table.Th className="py-4 text-sm font-semibold text-gray-700">
          Timeline
        </Table.Th>
        <Table.Th className="pr-6 py-4 text-sm font-semibold text-gray-700 text-right">
          Actions
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
