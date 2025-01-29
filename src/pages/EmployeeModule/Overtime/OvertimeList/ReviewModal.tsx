import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useApproveOvertimeMutation } from "../../../../features/api/overtimeSlice";
import { notifications } from "@mantine/notifications";
import { IconBan, IconCheck, IconX } from "@tabler/icons-react";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { Button, Group, TextInput } from "@mantine/core";

interface OvertimeReviewModalProps {
  close: () => void;
  uid: string;
}

interface OvertimeApprovalResponse {
  data?: {
    message: string;
    status_code: number;
  };
  error?: FetchBaseQueryError | SerializedError;
}

const OvertimeReviewModal: React.FC<OvertimeReviewModalProps> = ({
  close,
  uid,
}) => {
  const [value, setValue] = useState("");
  const [approveOvertime, { isLoading, error }] = useApproveOvertimeMutation();

  const handleApprove = async () => {
    try {
      const res = (await approveOvertime({
        uid,
        is_approved: "approved",
      })) as OvertimeApprovalResponse;
      console.log(res);
      notifications.show({
        title: "Success!",
        message: res?.data?.message || "Overtime Approved Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      close();
    } catch (error) {
      console.error("Error approving overtime:", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't update overtime status",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleReject = async () => {
    try {
      const res = (await approveOvertime({
        uid,
        is_approved: "rejected",
        reject_purpose: value,
      })) as OvertimeApprovalResponse;
      notifications.show({
        title: "Success!",
        message: res?.data?.message || "Overtime Rejected Successfully",
        icon: <IconBan />,
        color: "green",
        autoClose: 3000,
      });
      close();
    } catch (error) {
      console.error("Error rejecting overtime:", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't update overtime status",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError
  ): string => {
    if ("status" in error) {
      // Handle FetchBaseQueryError
      return typeof error.data === "string"
        ? error.data
        : "An unexpected error occurred.";
    } else if ("message" in error) {
      // Handle SerializedError
      return error.message ?? "An unknown error occurred.";
    }
    return "An unknown error occurred.";
  };

  if (error) {
    const errorMessage = getErrorMessage(error);
    return <ErrorAlert message={errorMessage} />;
  }

  return (
    <>
      <TextInput
        placeholder="Reason for rejection"
        mb={20}
        value={value}
        onChange={(event) => {
          setValue(event.currentTarget.value);
        }}
      />
      <Group justify="flex-end">
        <Button
          variant="outline"
          size="compact-md"
          color="green"
          className="text-sm"
          onClick={handleApprove}
          disabled={isLoading}
        >
          Approve
        </Button>
        <Button
          variant="outline"
          color="red"
          size="compact-md"
          className="text-sm"
          onClick={handleReject}
          disabled={isLoading}
        >
          Reject
        </Button>
      </Group>
    </>
  );
};

export default OvertimeReviewModal;
