import { Pill } from "@mantine/core";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";

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
      {status === "pending" ? (
        <div className="flex items-center gap-1">
          <span>
            <IconClock size={16} />
          </span>
          Pending
        </div>
      ) : status === "approved" ? (
        <div className="flex items-center gap-1">
          <span>
            <IconCheck size={16} />
          </span>
          Approved
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span>
            <IconX size={16} />
          </span>
          Rejected
        </div>
      )}
    </Pill>
  );
};

export default AppApprovalStatus;
