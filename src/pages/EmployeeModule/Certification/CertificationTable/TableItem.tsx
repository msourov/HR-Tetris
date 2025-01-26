import { Modal, Pill, Table } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import CommonSkeleton from "../../../../components/shared/CommonSkeleton";
import { Certification } from "../../../../features/types/certification";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useDisclosure } from "@mantine/hooks";
import CertificationDetail from "../CertificationDetail";
import { useState } from "react";

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
  const [opened, { open, close }] = useDisclosure(false);
  const [currentUid, setCurrentUid] = useState<string>("");

  if (isLoading) {
    return <CommonSkeleton cols={6} rows={5} />;
  }

  if (error) {
    return <ErrorAlert message="Error fetching certifications" />;
  }

  return (
    <>
      <Table.Tbody className="text-black font-medium px-4 bg-gray-100 border">
        {data.map((item, index) => (
          <Table.Tr
            key={item.uid}
            className="cursor-pointer hover:bg-white"
            onClick={() => {
              open();
              setCurrentUid(item.uid);
            }}
          >
            <Table.Td style={{ width: "5%" }}>{index + 1}</Table.Td>
            <Table.Td style={{ width: "20%" }}>
              {item.employee_name || "N/A"}
            </Table.Td>
            <Table.Td style={{ width: "20%" }}>
              {item.certification_type || "N/A"}
            </Table.Td>
            <Table.Td style={{ width: "25%" }}>
              {item.purpose || "N/A"}
            </Table.Td>
            <Table.Td
              style={{
                width: "10%",
                fontSize: "0.8rem",
              }}
            >
              <Pill bg="gray" c="white">
                {item.apply_date
                  ? new Date(item.apply_date).toLocaleDateString()
                  : "N/A"}
              </Pill>
            </Table.Td>
            <Table.Td style={{ width: "8%" }}>
              <Pill
                size="sm"
                c={
                  item.is_approved === "pending"
                    ? "yellow"
                    : item.is_approved === "rejected"
                    ? "red"
                    : "green"
                }
                className={
                  item.is_approved === "pending"
                    ? "bg-yellow-100"
                    : item.is_approved === "rejected"
                    ? "bg-red-200"
                    : "bg-green-200"
                }
              >
                {item.is_approved.toUpperCase()}
              </Pill>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Modal opened={opened} onClose={close} size="auto">
        <CertificationDetail uid={currentUid} closeModal={close} />
      </Modal>
    </>
  );
};

export default TableItem;
