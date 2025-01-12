import React from "react";
import { Pill, Table, Tooltip } from "@mantine/core";
import { AccessPermissions, Role } from "../../../../features/api/typesOld";
import RoleActions from "./RoleActions";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import "../../../../styles.css";

interface TableItemProps {
  data: Role[];
  loading: boolean;
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

const transformAccess = (access: AccessPermissions): [string, string][] => {
  const dataArr: [string, string][] = Object.entries(access);
  const seenKeys = new Set<string>();

  return dataArr
    .filter(([, value]) => value === "a")
    .map(([key]) => {
      const subwords = key.split("_");
      const fullName = subwords
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ");
      let shortName = subwords
        .map((subword) => subword.charAt(0).toUpperCase())
        .join("");

      // Check for duplicate short names and adjust if necessary
      if (seenKeys.has(shortName)) {
        shortName = `${subwords[0].charAt(0).toUpperCase()}${subwords[0]
          .charAt(subwords[0].length - 1)
          .toUpperCase()}${subwords[1].charAt(0).toUpperCase()}`;
      } else {
        seenKeys.add(shortName);
      }

      return [shortName, fullName];
    });
};

const TableItem: React.FC<TableItemProps> = ({ data, loading }) => {
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

  if (loading) {
    return <CommonSkeleton cols={5} rows={5} />;
  }

  return (
    <Table.Tbody>
      {data.map((item, index) => (
        <Table.Tr key={index}>
          <Table.Td style={{ width: "10%", paddingLeft: "32px" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>{item?.name}</Table.Td>
          <Table.Td style={{ width: "40%" }}>
            <Pill.Group>
              {transformAccess(item?.access || {}).map(
                ([shortName, fullName], index) => (
                  <Tooltip key={index} label={fullName} withArrow>
                    <Pill
                      style={{
                        backgroundColor:
                          colors[shortName as keyof ColorMap] || "#ccc",
                        color: "white",
                      }}
                    >
                      {shortName}
                    </Pill>
                  </Tooltip>
                )
              )}
            </Pill.Group>
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            <Pill className={item?.active ? "pill-active" : "pill-inactive"}>
              {item?.active ? "Active" : "Inactive"}
            </Pill>
          </Table.Td>
          <Table.Td style={{ width: "5%", paddingRight: "32px" }}>
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
