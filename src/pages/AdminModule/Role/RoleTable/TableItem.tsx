import React from "react";
import { Pill, Table } from "@mantine/core";
import { AccessPermissions, Role } from "../../../../features/api/types";
import RoleActions from "./RoleActions";

interface TableItemProps {
  data: Role[];
}

type ColorMap = {
  UM: string;
  OM: string;
  AUM: string;
  CM: string;
  TM: string;
  AM: string;
  EM: string;
  IM: string;
  RM: string;
  ATM: string;
};

const TableItem: React.FC<TableItemProps> = ({ data }) => {
  const colors: ColorMap = {
    UM: "#f44336",
    OM: "#2196f3",
    AUM: "#4caf50",
    CM: "#ff9800",
    TM: "#9c27b0",
    AM: "#00bcd4",
    EM: "#ffc107",
    IM: "#607d8b",
    RM: "#795548",
    ATM: "#3f51b5",
  };

  const transformAccess = (access: AccessPermissions): string[] => {
    const dataArr: [string, string][] = Object.entries(access);
    const seenKeys = new Set<string>();
    return dataArr
      .filter(([, value]) => value === "a")
      .map(([key]) => {
        const subwords = key.split("_");
        let processedKey = subwords
          .map((subword) => subword.charAt(0).toUpperCase())
          .join("");

        if (seenKeys.has(processedKey)) {
          // If the key has been seen, use the first and last letter of the first subword and the first letter of the second subword
          processedKey = `${subwords[0].charAt(0).toUpperCase()}${subwords[0]
            .charAt(subwords[0].length - 1)
            .toUpperCase()}${subwords[1].charAt(0).toUpperCase()}`;
        } else {
          // Add the key to the set of seen keys
          seenKeys.add(processedKey);
        }

        return processedKey;
      });
  };

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
            <RoleActions
              id={item?.uid}
              name={item?.name}
              disabled={item?.super_admin}
            />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
