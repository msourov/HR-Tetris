import React from "react";
import { Pill, Table, Tooltip } from "@mantine/core";
import RoleActions from "./RoleActions";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import "../../../../styles.css";
import { ColorMap } from ".";
import { Role } from "../../../../features/types/role";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { AccessPermissions } from "../../../../features/types/shared";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

interface TableItemProps {
  data: Role[];
  loading: boolean;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

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

const TableItem: React.FC<TableItemProps> = ({ data, loading, error }) => {
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
    return <CommonSkeleton cols={4} rows={5} />;
  }

  if (error) {
    <ErrorAlert message="Error fetching users" />;
  }

  return (
    <Table.Tbody>
      {data.map((item, index) => (
        <Table.Tr key={index}>
          <Table.Td className="w-[25%] pl-4 lg:pl-6">
            <div
              className={`w-fit border p-1 rounded-full text-xs text-center 
    ${
      item.name === "Super Admin"
        ? "bg-red-500 text-white border-red-600"
        : "bg-gray-500 text-white border-gray-500"
    }`}
            >
              {item?.name}
            </div>
          </Table.Td>
          <Table.Td className="w-[40%]">
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
          <Table.Td className="w-[15%]">
            <Pill className={item?.active ? "pill-active" : "pill-inactive"}>
              {item?.active ? "Active" : "Inactive"}
            </Pill>
          </Table.Td>
          <Table.Td className="w-[20%] pr-4 lg:pr-6">
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
