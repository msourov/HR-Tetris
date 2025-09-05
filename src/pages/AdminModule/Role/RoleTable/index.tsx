import { Pagination, Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import { Role } from "../../../../features/api/typesOld";
import TableItem from "./TableItem";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";
import { useState } from "react";

export type ColorMap = {
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

const AcronymDetails = () => {
  const acronymMap = {
    UM: "User Management",
    OM: "Office Management",
    AUM: "App User Management",
    CM: "CLM Management",
    TM: "Ticket Management",
    AM: "Accounts Management",
    EM: "Employee Management",
    IM: "Inventory Management",
    RM: "Recruitment Management",
    ATM: "Announcement Management",
  };

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

  return (
    <div className="p-4 bg-white border">
      {/* <h3 className="text-lg font-semibold mb-4">Acronym Definitions</h3> */}
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(acronymMap).map(([acronym, fullName]) => (
          <div
            key={acronym}
            className="flex items-center gap-2 border-b p-1 text-sm"
            style={{
              borderBottomColor: colors[acronym as keyof ColorMap],
            }}
          >
            <p
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: colors[acronym as keyof ColorMap] }}
            ></p>
            <span className="font-medium">{acronym}:</span>
            <p
              className="text-gray-600"
              style={{ color: colors[acronym as keyof ColorMap] }}
            >
              {fullName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoleTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching, error } = useGetRolesQuery({
    page: page,
    limit: limit,
  });
  const roles: Role[] = data?.data || [];
  console.log(error, "error");
  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:gap-4">
      <div className="flex-1 border bg-white">
        <Table striped highlightOnHover>
          <TableHeading />
          <TableItem data={roles} loading={isLoading} error={error} />
        </Table>
        <div className="px-4 pt-8 pb-4 flex justify-end items-end">
          <Pagination
            total={data?.pagination?.total_pages ?? 0}
            value={page}
            onChange={setPage}
            color="blue"
            disabled={isFetching}
          />
        </div>
      </div>

      <AcronymDetails />
    </div>
  );
};

export default RoleTable;
