import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconBan, IconX } from "@tabler/icons-react";
import { Button, Group, TextInput } from "@mantine/core";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { useApprovePolicyMutation } from "../../../../features/api/policySlice";

interface PolicyApprovalModalProps {
  uid: string;
  close: () => void;
}

const PolicyReviewModal = ({ uid, close }: PolicyApprovalModalProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [approvePolicy, { isLoading, error }] = useApprovePolicyMutation();

  const handleApprove = async () => {
    try {
      const res = await approvePolicy({
        uid,
        is_approved: "approved",
        reject_purpose: "",
      });
      notifications.show({
        title: "Success!",
        message: res.data?.message || "Policy approved successfully",
        icon: <IconCheck />,
        color: "green",
      });
      close();
    } catch {
      notifications.show({
        title: "Error!",
        message: "Failed to approve policy",
        icon: <IconX />,
        color: "red",
      });
    }
  };

  const handleReject = async () => {
    try {
      const res = await approvePolicy({
        uid,
        is_approved: "rejected",
        reject_purpose: rejectReason,
      });
      notifications.show({
        title: "Success!",
        message: res.data?.message || "Policy rejected successfully",
        icon: <IconBan />,
        color: "green",
      });
      close();
    } catch {
      notifications.show({
        title: "Error!",
        message: "Failed to reject policy",
        icon: <IconX />,
        color: "red",
      });
    }
  };

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null) {
      if ("status" in error) {
        // @ts-expect-error: error may have data property
        return typeof error.data === "string"
          ? // @ts-expect-error: error may have data property
            error.data
          : "An unexpected error occurred.";
      } else if ("message" in error) {
        return error.message ?? "An unknown error occurred.";
      }
    }
    return "An unknown error occurred.";
  };

  if (error) {
    return <ErrorAlert message={getErrorMessage(error)} />;
  }

  return (
    <>
      <TextInput
        placeholder="Reason for rejection"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.currentTarget.value)}
        mb="md"
      />
      <Group justify="right" gap="sm">
        <Button color="green" onClick={handleApprove} disabled={isLoading}>
          Approve
        </Button>
        <Button
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

export default PolicyReviewModal;
