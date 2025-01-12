import { Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import { Certification } from "../../../../features/types/certification";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useNavigate } from "react-router-dom";

interface TableItemProps {
  data: Certification[];
  isLoading: boolean;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const TableItem: React.FC<TableItemProps> = ({ data, isLoading, error }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <CommonSkeleton cols={9} rows={5} />;
  }
  if (error) {
    return <ErrorAlert message="Error fetching certifications" />;
  }
  const handleRowClick = (uid: string) => {
    navigate(`/certifications/${uid}`);
  };

  return (
    <Table.Tbody className="text-black font-medium">
      {data.map((item, index) => (
        <Table.Tr
          key={item.uid}
          onClick={() => handleRowClick(item?.uid)}
          className="hover:cursor-pointer hover:bg-blue-50"
        >
          <Table.Td style={{ width: "2%", paddingLeft: "1.5rem" }}>
            {index + 1}
          </Table.Td>
          <Table.Td style={{ width: "15%" }}>
            {item.employee_name || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {item.employee_id || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>{item.purpose || "N/A"}</Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {item.certification_type || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {new Date(item.apply_date).toLocaleDateString() || "N/A"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {item.is_active ? "Active" : "Inactive"}
          </Table.Td>
          <Table.Td style={{ width: "10%" }}>
            {item.is_approved || "Pending"}
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default TableItem;
