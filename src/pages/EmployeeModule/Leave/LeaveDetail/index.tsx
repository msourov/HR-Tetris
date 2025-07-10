import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Group,
  Text,
  TextInput,
  Textarea,
  Button,
  Divider,
  Timeline,
  ScrollArea,
  Grid,
} from "@mantine/core";
import {
  IconUser,
  IconInfoCircle,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import { DatePickerInput } from "@mantine/dates";
import { ErrorResponse } from "react-router-dom";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import useFormatDate from "../../../../services/utils/useFormatDate";
import {
  useDeleteLeaveMutation,
  useGetLeaveDetailQuery,
  useUpdateLeaveMutation,
} from "../../../../features/api/leaveSlice";
import { Log } from "../../../../features/types/shared";
import AppLoader from "../../../../components/ui/AppLoader";

const leaveSchema = z
  .object({
    leave_type: z.string().min(1, "Leave type is required"),
    purpose: z.string().min(1, "Purpose is required"),
    leave_preiod: z.string().min(1, "Leave period is required"),
    leave_start_date: z.date({ required_error: "Start date is required" }),
    leave_end_date: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.leave_end_date > data.leave_start_date, {
    message: "End date must be later than start date",
    path: ["leave_end_date"],
  });

const LeaveDetail = ({
  uid,
  closeModal,
}: {
  uid: string;
  closeModal: () => void;
}) => {
  const { data, isLoading, error, refetch } = useGetLeaveDetailQuery({ uid });
  const [updateLeave, { isLoading: updateLoading }] = useUpdateLeaveMutation();
  const [deleteLeave, { isLoading: deleteLoading }] = useDeleteLeaveMutation();
  const { formatDate } = useFormatDate();
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);

  const leaveData = data?.data
    ? Array.isArray(data.data)
      ? data.data[0]
      : data.data
    : null;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<{
    leave_type: string;
    purpose: string;
    leave_preiod: string;
    leave_start_date: Date;
    leave_end_date: Date;
  }>({
    resolver: zodResolver(leaveSchema),
  });

  useEffect(() => {
    if (leaveData) {
      reset({
        leave_type: leaveData.leave_type || "",
        purpose: leaveData.purpose || "",
        leave_preiod: leaveData.leave_preiod || "",
        leave_start_date: new Date(leaveData.leave_start_date),
        leave_end_date: new Date(leaveData.leave_end_date),
      });
      setDate([
        leaveData.leave_start_date
          ? new Date(leaveData.leave_start_date)
          : null,
        leaveData.leave_end_date ? new Date(leaveData.leave_end_date) : null,
      ]);
    }
  }, [leaveData, reset]);

  const handleEditSubmit = async (formData: {
    leave_type: string;
    purpose: string;
    leave_preiod: string;
    leave_start_date: Date;
    leave_end_date: Date;
  }) => {
    try {
      if (!leaveData?.uid || !leaveData?.employee_id) {
        throw new Error("UID or Employee ID is missing");
      }
      const payload = {
        ...formData,
        uid: leaveData.uid,
        leave_start_date: date[0] ? date[0].toISOString() : "",
        leave_end_date: date[1] ? date[1].toISOString() : "",
        amount: 0,
        employee_id: leaveData.employee_id,
      };
      const response = await updateLeave(payload).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Leave updated successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "An error occurred while updating leave",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteLeave = async () => {
    try {
      if (!leaveData?.uid) {
        throw new Error("UID is missing");
      }
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

  if (isLoading) {
    return <AppLoader />;
  }

  if (error) return <ErrorAlert message="Error fetching leave detail" />;

  if (!leaveData) return <ErrorAlert message="No leave data found" />;

  return (
    <Card radius="md" p="lg" className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-orange-400 text-center">
        Leave Request
      </h1>
      <Group justify="space-between" mb="md">
        <div>
          <Text c="dimmed" fz="sm">
            Created: {formatDate(leaveData.create_at)}
          </Text>
        </div>
        <Group>
          <AppApprovalStatus status={leaveData?.is_approved} />
          {leaveData?.is_approved === "pending" && (
            <Button
              variant="subtle"
              color="yellow"
              leftSection={<IconEdit size={18} />}
              onClick={() => setIsEditing((prev) => !prev)}
              className="p-0"
            >
              Edit
            </Button>
          )}
        </Group>
      </Group>

      <form onSubmit={handleSubmit(handleEditSubmit)}>
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group gap="xs">
              <IconUser size={16} className="text-blue-500" />
              <Text fw={500} c="dimmed" size="sm">
                EID
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text className="text-blue-700 font-semibold">
              {leaveData.employee_id}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group gap="xs">
              <IconInfoCircle size={16} className="text-green-500" />
              <Text fw={500} c="dimmed" size="sm">
                Type
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {isEditing ? (
              <TextInput
                variant="filled"
                value={watch("leave_type") || ""}
                {...register("leave_type")}
                error={errors.leave_type?.message}
              />
            ) : (
              <Text className="">{leaveData.leave_type}</Text>
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group gap="xs">
              <IconClock size={16} className="text-purple-500" />
              <Text fw={500} c="dimmed" size="sm">
                Period
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {isEditing ? (
              <TextInput
                variant="filled"
                {...register("leave_preiod")}
                error={errors.leave_preiod?.message}
              />
            ) : (
              <Text>{leaveData.leave_preiod}</Text>
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group gap="xs">
              <IconCalendar size={16} className="text-blue-500" />
              <Text fw={500} c="dimmed" size="sm">
                Dates
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {isEditing ? (
              <DatePickerInput
                type="range"
                variant="filled"
                value={date}
                onChange={setDate}
                error={
                  errors.leave_start_date?.message ||
                  errors.leave_end_date?.message
                }
              />
            ) : (
              <Text className="py-1 rounded-md font-mono text-blue-800">
                {formatDate(leaveData.leave_start_date)} -{" "}
                {formatDate(leaveData.leave_end_date)}
              </Text>
            )}
          </Grid.Col>

          <Grid.Col span={12}>
            <Divider
              label={<Text size="sm">Purpose</Text>}
              labelPosition="center"
              mb="sm"
            />
            <Textarea
              autosize
              minRows={3}
              maxRows={6}
              readOnly={!isEditing}
              variant={isEditing ? "filled" : "unstyled"}
              classNames={{
                input:
                  "bg-gray-50 read-only:bg-transparent read-only:cursor-text",
              }}
              className="border bg-gray-50 px-2"
              {...register("purpose")}
              error={errors.purpose?.message}
            />
          </Grid.Col>

          {leaveData.is_approved === "rejected" && (
            <Grid.Col span={12}>
              <div className="p-3 bg-red-50 rounded-md border border-red-100">
                <Text fw={500} size="sm" c="red" mb="xs">
                  Rejection Reason
                </Text>
                <Text className="px-3 py-2 bg-white rounded-md">
                  {leaveData.reject_purpose}
                </Text>
              </div>
            </Grid.Col>
          )}

          {/* Activity Log */}
          <Grid.Col span={12}>
            <Divider
              label={<Text size="sm">Activity Log</Text>}
              labelPosition="center"
              mb="lg"
              className="w-full"
            />
            <ScrollArea.Autosize
              mah={220}
              className="pr-4 bg-gray-50 rounded-lg p-4 border"
            >
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                {leaveData.logs && (
                  <>
                    {Array.isArray(leaveData.logs) ? (
                      leaveData.logs.map((log: Log, index: number) => (
                        <Timeline.Item
                          key={index}
                          bullet={<IconUser size={12} />}
                          title={`${log.admin}`}
                        >
                          <Text size="sm" className="text-gray-500">
                            {log.message}
                          </Text>
                          <Text mt={2} c="blue">
                            {formatDate(log.create_at, true)}
                          </Text>
                        </Timeline.Item>
                      ))
                    ) : (
                      <Timeline.Item
                        bullet={<IconUser size={12} />}
                        title={`${leaveData.logs.admin}`}
                      >
                        <Text c="dimmed" size="sm">
                          {leaveData.logs.message}
                        </Text>
                        <Text size="sm" mt={2} c="blue">
                          {formatDate(leaveData.logs.create_at, true)}
                        </Text>
                      </Timeline.Item>
                    )}
                  </>
                )}
              </Timeline>
            </ScrollArea.Autosize>
          </Grid.Col>

          {/* Actions */}
          <Grid.Col span={12} mt="lg">
            <Group justify="flex-end" gap="sm">
              {isEditing ? (
                <>
                  <Button
                    variant="default"
                    onClick={() => setIsEditing(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="blue"
                    loading={updateLoading}
                    size="sm"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="default" onClick={closeModal} size="sm">
                    Close
                  </Button>
                  <Button
                    color="red"
                    variant="filled"
                    onClick={handleDeleteLeave}
                    size="sm"
                    loading={deleteLoading}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Card>
  );
};

export default LeaveDetail;
