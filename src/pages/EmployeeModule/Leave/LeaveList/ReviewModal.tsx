import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useApproveLeaveMutation } from "../../../../features/api/leaveSlice";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconBan } from "@tabler/icons-react";
import React from "react";

interface LeaveRequestModalProps {
  opened: boolean;
  close: () => void;
  employee_id: string;
  uid: string;
  is_approved: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const LeaveReviewModal: React.FC<LeaveRequestModalProps> = ({
  opened,
  close,
  employee_id,
  uid,
  is_approved,
  value,
  setValue,
}) => {
  const [approveLeave, { isLoading }] = useApproveLeaveMutation();

  const handleApprove = async () => {
    try {
      await approveLeave({ uid, is_approved: "approved", reject_purpose: "" });
      notifications.show({
        title: "Success!",
        message: "Overtime Approved Successfully",
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
      await approveLeave({
        uid,
        is_approved: "rejected",
        reject_purpose: value,
      });
      notifications.show({
        title: "Success!",
        message: "Overtime Rejected Successfully",
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

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={
        <Text c="dimmed">
          Reviewing Overtime Approval Request of employee{" "}
          <span className="text-blue-500 font-bold">{employee_id}</span>
        </Text>
      }
    >
      <TextInput
        placeholder="Reason for rejection"
        mb={20}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
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
    </Modal>
  );
};

export default LeaveReviewModal;
