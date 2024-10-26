import {
  Card,
  Text,
  Badge,
  Pill,
  Button,
  Group,
  TextInput,
  Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconBan, IconX } from "@tabler/icons-react";
import { useState } from "react";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useDisclosure } from "@mantine/hooks";
import { useApproveLeaveMutation } from "../../../../features/api/leaveSlice";

interface LeaveData {
  employee_id: string;
  employee_name: string;
  uid: string;
  purpose: string;
  leave_type: string;
  leave_start_date: string;
  leave_end_date: string;
  is_approved: string;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const CustomCard: React.FC<LeaveData> = ({
  employee_id,
  employee_name,
  uid,
  purpose,
  leave_type,
  leave_start_date,
  leave_end_date,
  is_approved,
}: LeaveData) => {
  const [value, setValue] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [approveLeave, { isLoading, error }] = useApproveLeaveMutation();

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
    <Card className="w-full py-4 px-6 border border-gray-200 rounded-lg shadow-lg flex flex-row">
      {/* Left section (80%) */}
      <div className="w-5/6 pr-4">
        <Text className="text-lg font-semibold">{employee_name}</Text>
        <Text className="mt-1 text-gray-700">{purpose}</Text>
        <Text className="mt-1 text-gray-500 italic">{leave_type}</Text>{" "}
        {/* Added leave type */}
        {new Date(leave_start_date).toLocaleDateString() ===
        new Date(leave_end_date).toLocaleDateString() ? (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              <Pill className="font-bold text-sm mb-2 text-blue-500">
                {new Date(leave_start_date).toLocaleDateString()}
              </Pill>
            </Text>
            <Text className="text-sm">
              <Pill className="font-bold text-sm">
                {new Date(leave_start_date).toLocaleTimeString()}
              </Pill>
              <Text span c="blue">
                {" "}
                to{" "}
              </Text>
              <Pill className="font-bold text-sm">
                {new Date(leave_end_date).toLocaleTimeString()}
              </Pill>
            </Text>
          </div>
        ) : (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              {new Date(leave_start_date).toLocaleDateString()} -{" "}
              {new Date(leave_start_date).toLocaleTimeString()}
            </Text>
            <Text className="text-sm">
              <Text span c="blue" className="font-bold ">
                To:{" "}
              </Text>
              {new Date(leave_end_date).toLocaleDateString()} -{" "}
              {new Date(leave_end_date).toLocaleTimeString()}
            </Text>
          </div>
        )}
      </div>

      {/* Right section (20%) */}
      <div className="w-1/6 flex flex-col items-end justify-start gap-4">
        <Badge
          color={
            is_approved === "approved"
              ? "green"
              : is_approved === "reject" || is_approved === "rejected"
              ? "red"
              : "yellow"
          }
          size="lg"
          className="px-3 py-1"
        >
          {is_approved === "pending"
            ? is_approved.toUpperCase()
            : is_approved === "reject"
            ? "REJECTED"
            : is_approved.toUpperCase()}
        </Badge>
        {is_approved === "pending" && (
          <Button onClick={open} variant="light" size="sm">
            Review
          </Button>
        )}
      </div>

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
      </Modal>
    </Card>
  );
};

export default CustomCard;
