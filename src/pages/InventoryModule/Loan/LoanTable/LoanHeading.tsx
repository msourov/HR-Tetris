import { Table } from "@mantine/core";

const LoanTableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white">
      <Table.Tr>
        <Table.Th className="w-1/20">Serial</Table.Th>
        <Table.Th className="w-1/5">Loan</Table.Th>
        <Table.Th className="w-1/10">Amount</Table.Th>
        <Table.Th className="w-1/10">Category</Table.Th>
        <Table.Th className="w-3/20">Employee</Table.Th>
        <Table.Th className="w-3/20">Guarantor</Table.Th>
        <Table.Th className="w-1/10">Status</Table.Th>
        <Table.Th className="w-1/10">Created At</Table.Th>
        <Table.Th className="w-1/20">Actions</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default LoanTableHeading;
