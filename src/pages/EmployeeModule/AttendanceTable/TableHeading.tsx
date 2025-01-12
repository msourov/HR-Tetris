import { Table } from "@mantine/core";

const TableHeading = () => {
  return (
    <Table.Thead className="bg-[#2274A5] text-white px-4">
      <Table.Tr>
        <Table.Th style={{ width: "10%", paddingLeft: "32px" }}>
          Serial
        </Table.Th>
        <Table.Th style={{ width: "10%" }}>Employee ID</Table.Th>
        <Table.Th style={{ width: "10%" }}>Attendance Status</Table.Th>{" "}
        <Table.Th style={{ width: "10%" }}>Date Attended</Table.Th>{" "}
        <Table.Th style={{ width: "25%", paddingRight: "32px" }}>
          Home Office Status
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeading;
