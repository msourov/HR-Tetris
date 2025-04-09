import { Pill } from "@mantine/core";

const AppApprovalStatus = ({ status }: { status: string }) => {
  return (
    <Pill
      size="sm"
      c={
        status === "pending"
          ? "yellow"
          : status === "approved"
          ? "green"
          : "red"
      }
      className={
        status === "pending"
          ? "bg-yellow-100"
          : status === "approved"
          ? "bg-green-200"
          : "bg-red-200"
      }
    >
      {status === "pending"
        ? "Pending"
        : status === "approved"
        ? "Approved"
        : "Rejected"}
    </Pill>
  );
};

export default AppApprovalStatus;
