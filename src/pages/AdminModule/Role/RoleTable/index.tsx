import { Table } from "@mantine/core";
import TableHeading from "./TableHeading";
import { Role } from "../../../../features/api/typesOld";
import TableItem from "./TableItem";
import { useGetRolesQuery } from "../../../../features/api/roleSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../../../services/auth/useAuth";


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
    CM: "CLM Management", // CLM might need full form if available
    TM: "Ticket Management",
    AM: "Accounts Management",
    EM: "Employee Management",
    IM: "Inventory Management",
    RM: "Recruitment Management",
    ATM: "Announcement Management"
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
    <div className="p-4 bg-white rounded-lg border">
      {/* <h3 className="text-lg font-semibold mb-4">Acronym Definitions</h3> */}
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(acronymMap).map(([acronym, fullName]) => (
          <div key={acronym} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: colors[acronym as keyof ColorMap] }}
            ></span>
            <span className="font-medium">{acronym}:</span>
            <span className="text-gray-600">{fullName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoleTable: React.FC = () => {
  const { data, isLoading, error } = useGetRolesQuery({ page: 1, limit: 10 });
  const { logout } = useAuth();
  const roles: Role[] = data?.data || [];

  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching roles:", error);
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 py-8 px-4">
      <div className="flex-1 border">
        <Table>
          <TableHeading />
          <TableItem data={roles} loading={isLoading} />
        </Table>
      </div>

      <AcronymDetails />
    </div>
  );
};

export default RoleTable;
