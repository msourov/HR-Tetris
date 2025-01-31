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
  Pill,
  Loader,
  ActionIcon,
} from "@mantine/core";
import {
  IconUser,
  IconInfoCircle,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
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

// Define the schema
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
    setValue,
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
    return (
      <div className="flex justify-center items-center h-32">
        <Loader type="dots" />
      </div>
    );
  }

  if (error) return <ErrorAlert message="Error fetching leave detail" />;

  if (!leaveData) return <ErrorAlert message="No leave data found" />;

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
        <Group>
          <AppApprovalStatus status={leaveData?.is_approved} />
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => setIsEditing(!isEditing)}
          >
            <IconEdit size={18} />
          </ActionIcon>
        </Group>
      </Group>

      <form onSubmit={handleSubmit(handleEditSubmit)}>
        <div className="space-y-4">
          <Group gap="xs">
            <IconUser size={16} className="text-blue-500" />
            <Text fw={500} c="dimmed" size="sm">
              EID:
            </Text>
            <Pill bg="grape" c="white" size="md">
              {leaveData.employee_id}
            </Pill>
          </Group>

          <Group gap="xs">
            <IconInfoCircle size={16} className="text-green-500" />
            <Text fw={500} c="dimmed" size="sm">
              Leave Type:
            </Text>
            {isEditing ? (
              <TextInput
                variant="filled"
                value={watch("leave_type") || ""}
                {...register("leave_type")}
                onChange={(e) =>
                  setValue("leave_type", e.target.value, {
                    shouldValidate: true,
                  })
                }
                error={errors.leave_type?.message}
              />
            ) : (
              <Text className="border px-2 bg-gray-100 text-gray-600">
                {leaveData.leave_type}
              </Text>
            )}
          </Group>

          <Group className="flex justify-between">
            <Group gap="xs">
              {isEditing ? (
                <DatePickerInput
                  label={
                    <div className="flex items-center gap-2">
                      <IconCalendar size={16} className="text-blue-500" />
                      <Text fw={500} c="dimmed" size="sm">
                        Dates:
                      </Text>
                    </div>
                  }
                  variant="filled"
                  type="range"
                  onError={(error) => {
                    if (error) {
                      return (
                        errors.leave_start_date?.message ||
                        errors.leave_end_date?.message
                      );
                    }
                  }}
                  value={date}
                  onChange={setDate}
                  // value={[watch("leave_start_date"), watch("leave_end_date")]}
                  // onChange={([start, end]) => {
                  //   if (start)
                  //     setValue("leave_start_date", start, {
                  //       shouldValidate: true,
                  //     });
                  //   if (end)
                  //     setValue("leave_end_date", end, { shouldValidate: true });
                  // }}
                />
              ) : (
                <Text className="font-mono bg-blue-100 text-blue-800 rounded-lg px-2">
                  {formatDate(leaveData.leave_start_date)} -{" "}
                  {formatDate(leaveData.leave_end_date)}
                </Text>
              )}
            </Group>

            {isEditing ? (
              <TextInput
                variant="filled"
                description={<p className="text-sm">Period</p>}
                value={watch("leave_preiod")}
                {...register("leave_preiod")}
                onChange={(e) =>
                  setValue("leave_preiod", e.target.value, {
                    shouldValidate: true,
                  })
                }
                error={errors.leave_preiod?.message}
              />
            ) : (
              <Pill className="text-sm text-white bg-sky-500">
                {leaveData.leave_preiod}
              </Pill>
            )}
          </Group>

          <Divider
            label={<Text size="sm">Purpose</Text>}
            labelPosition="left"
          />
          {isEditing ? (
            <Textarea
              variant="filled"
              autosize
              minRows={2}
              maxRows={6}
              value={watch("purpose")}
              {...register("purpose")}
              error={errors.purpose?.message}
            />
          ) : (
            <Text c="grape">{leaveData.purpose}</Text>
          )}

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
          {isEditing ? (
            <>
              <Button
                variant="outline"
                color="gray"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="filled"
                color="blue"
                loading={updateLoading}
              >
                Save Changes
              </Button>
            </>
          ) : (
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
          )}
        </Group>
      </form>
    </Card>
  );
};

export default LeaveDetail;
