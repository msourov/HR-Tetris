import { Button, Group, TextInput } from "@mantine/core";
import { useApproveLeaveMutation } from "../../../../features/api/leaveSlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconBan } from "@tabler/icons-react";
import React, { useState } from "react";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface LeaveReviewModalProps {
  close: () => void;
  uid: string;
}

interface LeaveApprovalResponse {
  data?: {
    message: string;
    status_code: number;
  };
  error?: FetchBaseQueryError | SerializedError;
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({ close, uid }) => {
  const [approveLeave, { isLoading, error }] = useApproveLeaveMutation();
  const [value, setValue] = useState("");

  const handleApprove = async () => {
    try {
      const res = (await approveLeave({
        uid,
        is_approved: "approved",
        reject_purpose: "",
      })) as LeaveApprovalResponse;
      console.log(res);
      notifications.show({
        title: "Success!",
        message: res?.data?.message || "Leave Approved Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      close();
    } catch (error) {
      console.error("Error approving leave:", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't update leave status",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleReject = async () => {
    try {
      const res = (await approveLeave({
        uid,
        is_approved: "rejected",
        reject_purpose: value,
      })) as LeaveApprovalResponse;
      console.log(res);
      notifications.show({
        title: "Success!",
        message: res?.data?.message || "Leave Rejected Successfully",
        icon: <IconBan />,
        color: "green",
        autoClose: 3000,
      });
      close();
    } catch (error) {
      console.error("Error rejecting leave:", error);
      notifications.show({
        title: "Error!",
        message: "Couldn't update leave status",
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
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Group justify="flex-end">
        <Button
          variant="filled"
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

export default LeaveReviewModal;
