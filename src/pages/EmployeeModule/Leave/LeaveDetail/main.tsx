import {
  Loader,
  Card,
  Text,
  Group,
  Divider,
  Timeline,
  Button,
  Pill,
} from "@mantine/core";
import {
  useDeleteLeaveMutation,
  useGetLeaveDetailQuery,
} from "../../../../features/api/leaveSlice";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import dayjs from "dayjs";
import {
  IconCalendar,
  IconUser,
  IconInfoCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Leave } from "../../../../features/types/leave";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { notifications } from "@mantine/notifications";
import { ErrorResponse } from "react-router-dom";

const LeaveDetail = ({
  uid,
  closeModal,
}: {
  uid: string;
  closeModal: () => void;
}) => {
  const { data, isLoading, error } = useGetLeaveDetailQuery({ uid });
  const [deleteLeave, { isLoading: deleteLoading }] = useDeleteLeaveMutation();
  const { formatDate } = useFormatDate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader type="dots" />
      </div>
    );
  }

  const handleDeleteLeave = async () => {
    try {
      const response = await deleteLeave({ id: leaveData.uid }).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.message || "Leave deleted successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "An error occurred while deleting leave",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  if (error) return <ErrorAlert message="Error fetching leave detail" />;

  if (!data?.data) return <ErrorAlert message="No leave data found" />;

  const leaveData: Leave = Array.isArray(data.data) ? data.data[0] : data.data;

  return (
    <Card withBorder radius="md" p="xl" className="max-w-2xl mx-auto">
      <Group justify="space-between" mb="md">
        <div>
          <Text fz="xl" fw={700}>
            Leave Request
          </Text>
          <Text c="dimmed" fz="sm">
            Created: {formatDate(leaveData.create_at)}
          </Text>
        </div>
        <AppApprovalStatus status={leaveData?.is_approved} />
      </Group>

      <div className="space-y-4">
        <Group gap="xs">
          <IconUser size={18} className="text-blue-500" />
          <Text fw={500} c="dimmed">
            EID:
          </Text>
          <Text>{leaveData.employee_id}</Text>
        </Group>

        <Group gap="xs">
          <IconInfoCircle size={18} className="text-green-500" />
          <Text fw={500} c="dimmed">
            Leave Type:
          </Text>
          <Text>{leaveData.leave_type}</Text>
        </Group>

        <Group gap="xs">
          <IconCalendar size={18} className="text-blue-500" />
          <Text className="font-mono bg-blue-100 text-blue-800 rounded-lg px-2">
            {formatDate(leaveData.leave_start_date)} -{" "}
            {formatDate(leaveData.leave_end_date)}
          </Text>
          <Pill className="text-sm text-white bg-sky-500">
            {dayjs(leaveData.leave_end_date).diff(
              dayjs(leaveData.leave_start_date),
              "day"
            )}{" "}
            days
          </Pill>
        </Group>

        <Divider label="Purpose" labelPosition="left" />
        <Text c="grape">{leaveData.purpose}</Text>

        {leaveData.logs && (
          <>
            <Divider label="Activity Log" labelPosition="left" />
            <Timeline active={1} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<IconUser size={12} />}
                title={`Created by ${
                  Array.isArray(leaveData.logs)
                    ? leaveData.logs[0].admin
                    : leaveData.logs.admin
                }`}
              >
                <Text c="dimmed" size="sm">
                  {Array.isArray(leaveData.logs)
                    ? leaveData.logs[0].message
                    : leaveData.logs.message}
                </Text>
                <Text size="sm" mt={4} className="font-mono">
                  {Array.isArray(leaveData.logs)
                    ? formatDate(leaveData.logs[0].create_at)
                    : formatDate(leaveData.logs.create_at, true)}
                </Text>
              </Timeline.Item>
            </Timeline>
          </>
        )}
      </div>

      <Group justify="flex-end" mt="xl">
        <Button
          variant="filled"
          color="red"
          onClick={handleDeleteLeave}
          className="mt-4"
          disabled={deleteLoading}
        >
          Delete
        </Button>
        <Button
          variant="outline"
          color="blue"
          onClick={closeModal}
          className="mt-4"
        >
          Close
        </Button>
      </Group>
    </Card>
  );
};

export default LeaveDetail;
