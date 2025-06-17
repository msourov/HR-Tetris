import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconBan, IconX } from "@tabler/icons-react";
import { Button, Group, TextInput } from "@mantine/core";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import { useApproveHolidayMutation } from "../../../features/api/holidaySlice";

interface HolidayReviewModalProps {
  uid: string;
  close: () => void;
}

const HolidayReviewModal = ({ uid, close }: HolidayReviewModalProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [approveHoliday, { isLoading, error }] = useApproveHolidayMutation();

  const handleApprove = async () => {
    try {
      const res = await approveHoliday({
        uid,
        is_approved: "approved",
        reject_purpose: "",
      });

      if (!res.data || res.data.status_code !== 201) {
        throw new Error(res.data?.message || "Failed to approve holiday");
      }

      notifications.show({
        title: "Success!",
        message: res.data?.message || "Holiday approved successfully",
        icon: <IconCheck />,
        color: "green",
      });
      close();
    } catch (e) {
      notifications.show({
        title: "Error!",
        message: "Failed to approve holiday",
        icon: <IconX />,
        color: "red",
      });
    }
  };

  const handleReject = async () => {
    try {
      const res = await approveHoliday({
        uid,
        is_approved: "rejected",
        reject_purpose: rejectReason,
      });
      notifications.show({
        title: "Success!",
        message: res.data?.message || "Holiday rejected successfully",
        icon: <IconBan />,
        color: "green",
      });
      close();
    } catch (e) {
      notifications.show({
        title: "Error!",
        message: "Failed to reject holiday",
        icon: <IconX />,
        color: "red",
      });
    }
  };

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError
  ): string => {
    if ("status" in error) {
      return typeof error.data === "string"
        ? error.data
        : "An unexpected error occurred.";
    } else if ("message" in error) {
      return error.message ?? "An unknown error occurred.";
    }
    return "An unknown error occurred.";
  };

  if (error) {
    const msg = getErrorMessage(error);
    return <ErrorAlert message={msg} />;
  }

  return (
    <>
      <TextInput
        placeholder="Reason for rejection"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.currentTarget.value)}
        mb="md"
      />
      <Group justify="flex-end">
        <Button
          size="compact-md"
          color="green"
          onClick={handleApprove}
          disabled={isLoading}
        >
          Approve
        </Button>
        <Button
          size="compact-md"
          color="red"
          variant="outline"
          onClick={handleReject}
          disabled={isLoading}
        >
          Reject
        </Button>
      </Group>
    </>
  );
};

export default HolidayReviewModal;
