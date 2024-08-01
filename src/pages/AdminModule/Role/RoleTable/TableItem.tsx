import React from "react";
import { Pill, Table } from "@mantine/core";
import { Role } from "../../../../features/api/types";
import RoleActions from "./RoleActions";

interface TableItemProps {
  data: Role[];
}
interface Access {
  [key: string]: string;
}
type ColorMap = {
  UM: string;
  OM: string;
  AUM: string;
  EM: string;
};

const TableItem: React.FC<TableItemProps> = ({ data }) => {
  const colors: ColorMap = {
    UM: "#f44336",
    OM: "#2196f3",
    AUM: "#4caf50",
    EM: "#b57a05",
  };

  const transformAccess = (access: Access): string[] => {
    const dataArr: [string, string][] = Object.entries(access);
    return dataArr
      .filter(([, value]) => value === "a")
      .map(([key]) =>
        key
          .split("_")
          .map((subword) => subword.charAt(0).toUpperCase())
          .join("")
      );
  };

  //   console.log(accesses);
  return (
    <Table.Tbody>
      {data.map((item, index) => (
        <Table.Tr key={index}>
          <Table.Td style={{ width: "10%" }}>{index + 1}</Table.Td>
          <Table.Td style={{ width: "25%" }}>{item?.name}</Table.Td>
          <Table.Td style={{ width: "25%" }}>
            <Pill.Group>
              {transformAccess(item?.access || {}).map((item, index) => (
                <Pill
                  key={index}
                  style={{
                    backgroundColor: colors[item as keyof ColorMap] || "#ccc",
                    color: "white",
                  }}
                >
                  {item}
                </Pill>
              ))}
            </Pill.Group>
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <Pill className={item?.active ? "pill-active" : "pill-inactive"}>
              {item?.active ? "Active" : "Inactive"}
            </Pill>
          </Table.Td>
          <Table.Td style={{ width: "5%" }}>
            <RoleActions id={item?.uid} name={item?.name} disabled={item?.super_admin} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
