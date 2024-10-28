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
import { useApproveOvertimeMutation } from "../../../../features/api/overtimeSlice";
import { useState } from "react";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useDisclosure } from "@mantine/hooks";

interface OvertimeData {
  employee_id: string;
  employee_name: string;
  uid: string;
  purpose: string;
  start_time: string;
  end_time: string;
  is_approved: string;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const CustomCard: React.FC<OvertimeData> = ({
  employee_name,
  uid,
  purpose,
  start_time,
  end_time,
  is_approved,
}: OvertimeData) => {
  const [value, setValue] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [approveOvertime, { isLoading, error }] = useApproveOvertimeMutation();

  const handleApprove = async () => {
    try {
      await approveOvertime({ uid, is_approved: "approved" });
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
      await approveOvertime({
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
        <Text className="mt-2 text-gray-700">{purpose}</Text>
        {new Date(start_time).toLocaleDateString() ===
        new Date(end_time).toLocaleDateString() ? (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm font-semibold">
              <Pill className=" text-sm mb-2 text-blue-500">
                {new Date(start_time).toLocaleDateString()}
              </Pill>
            </Text>
            <Text className="text-sm font-medium">
              <Pill className="text-sm text-gray-600">
                {new Date(start_time).toLocaleTimeString()}
              </Pill>
              <Text span c="blue" className="font-bold w-10">
                {" "}
                -{" "}
              </Text>
              <Pill className="text-sm text-gray-600">
                {new Date(end_time).toLocaleTimeString()}
              </Pill>
            </Text>
          </div>
        ) : (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              {new Date(start_time).toLocaleDateString()} -{" "}
              {new Date(start_time).toLocaleTimeString()}
            </Text>
            <Text className="text-sm">
              <Text span c="blue" className="font-bold ">
                To:{" "}
              </Text>
              {new Date(end_time).toLocaleDateString()} -{" "}
              {new Date(end_time).toLocaleTimeString()}
            </Text>
          </div>
        )}
      </div>

      {/* Right section (20%) */}
      <div className="w-1/6 flex flex-col items-end justify-start gap-4">
        <Badge
          className={`px-3 py-1 text-xs font-semibold w-[100px] ${
            is_approved === "approved"
              ? "bg-green-100 text-green-700"
              : is_approved === "reject" || is_approved === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-500"
          }`}
          size="lg"
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
            <span className="text-blue-500 font-bold">{employee_name}</span>
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
