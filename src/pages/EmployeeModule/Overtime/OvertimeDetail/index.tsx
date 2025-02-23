import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Group,
  Text,
  Button,
  Divider,
  Timeline,
  Pill,
  Loader,
  ScrollArea,
  Textarea,
  Grid,
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
  useDeleteOvertimeMutation,
  useGetOvertimeDetailQuery,
  useUpdateOvertimeMutation,
} from "../../../../features/api/overtimeSlice";
import { Log } from "../../../../features/types/shared";

// Define the schema
const overtimeSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  start_time: z.date({ required_error: "Start time is required" }),
  end_time: z.date({ required_error: "End time is required" }),
});

const OvertimeDetail = ({
  uid,
  closeModal,
}: {
  uid: string;
  closeModal: () => void;
}) => {
  const { data, isLoading, error, refetch } = useGetOvertimeDetailQuery({
    uid,
  });
  const [updateOvertime, { isLoading: updateLoading }] =
    useUpdateOvertimeMutation();
  const [deleteOvertime, { isLoading: deleteLoading }] =
    useDeleteOvertimeMutation();

  const { formatDate } = useFormatDate();
  const [isEditing, setIsEditing] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const overtimeData = data?.data
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
    purpose: string;
    start_time: Date;
    end_time: Date;
  }>({
    resolver: zodResolver(overtimeSchema),
  });

  useEffect(() => {
    if (overtimeData) {
      reset({
        purpose: overtimeData.purpose || "",
        start_time: new Date(overtimeData.start_time),
        end_time: new Date(overtimeData.end_time),
      });
      setDateRange([
        overtimeData.start_time ? new Date(overtimeData.start_time) : null,
        overtimeData.end_time ? new Date(overtimeData.end_time) : null,
      ]);
    }
  }, [overtimeData, reset]);

  const handleEditSubmit = async (formData: {
    purpose: string;
    start_time: Date;
    end_time: Date;
  }) => {
    try {
      if (!overtimeData?.uid || !overtimeData?.employee_id) {
        throw new Error("UID or Employee ID is missing");
      }
      const payload = {
        ...formData,
        uid: overtimeData.uid,
        start_time: dateRange[0] ? dateRange[0].toISOString() : "",
        end_time: dateRange[1] ? dateRange[1].toISOString() : "",
        employee_id: overtimeData.employee_id,
        amount: 0,
      };
      const response = await updateOvertime(payload).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Overtime updated successfully",
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
          "An error occurred while updating overtime",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteOvertime = async () => {
    try {
      if (!overtimeData?.uid) {
        throw new Error("UID is missing");
      }
      const response = await deleteOvertime({
        overtime_id: overtimeData.uid,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Overtime deleted successfully",
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
          "An error occurred while deleting overtime",
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

  if (error) return <ErrorAlert message="Error fetching overtime detail" />;

  if (!overtimeData) return <ErrorAlert message="No overtime data found" />;

  return (
    <Card radius="md" p="lg" className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-orange-400 mb-4 text-center">
        Overtime Request
      </h1>
      <Group justify="space-between" mb="md">
        <div>
          <Text c="dimmed" fz="sm">
            Created: {formatDate(overtimeData.create_at)}
          </Text>
        </div>
        <Group>
          <AppApprovalStatus status={overtimeData?.is_approved} />
          {overtimeData?.is_approved === "pending" && (
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
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group gap="xs">
              <IconUser size={16} className="text-blue-500" />
              <Text fw={500} c="dimmed" size="sm">
                EID
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Pill bg="grape" c="white" size="md">
              {overtimeData.employee_id}
            </Pill>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group gap="xs">
              <IconInfoCircle size={16} className="text-green-500" />
              <Text fw={500} c="dimmed" size="sm">
                Purpose
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {isEditing ? (
              <Textarea
                autoFocus
                autosize
                minRows={2}
                maxRows={8}
                variant="filled"
                value={watch("purpose") || ""}
                {...register("purpose")}
                onChange={(e) =>
                  setValue("purpose", e.target.value, {
                    shouldValidate: true,
                  })
                }
                error={errors.purpose?.message}
                className="w-[100%]"
              />
            ) : (
              <Text className="px-3 py-1 bg-gray-100 rounded-md">
                {overtimeData.purpose}
              </Text>
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
                variant="filled"
                type="range"
                onError={(error) => {
                  if (error) {
                    return (
                      errors.start_time?.message || errors.end_time?.message
                    );
                  }
                }}
                value={dateRange}
                onChange={setDateRange}
              />
            ) : (
              <div className="">
                <Text className="font-mono bg-blue-100 text-blue-800 rounded-lg px-2">
                  {formatDate(overtimeData.start_time)} -{" "}
                  {formatDate(overtimeData.end_time)}
                </Text>
              </div>
            )}
          </Grid.Col>

          <Grid.Col span={12}>
            <Divider
              label="Activity Log"
              labelPosition="center"
              mb="lg"
              className="w-full"
            />
            <ScrollArea.Autosize
              mah={220}
              className="pr-4 bg-blue-500 rounded-lg p-4"
            >
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                {/* Check if logs exist */}
                {overtimeData.logs && (
                  <>
                    {Array.isArray(overtimeData.logs) ? (
                      overtimeData.logs.map((log: Log, index: number) => (
                        <Timeline.Item
                          key={index}
                          bullet={<IconUser size={12} />}
                          title={`${log.admin}`}
                          className="text-white"
                        >
                          <Text size="sm" className="text-gray-300">
                            {log.message}
                          </Text>
                          <Text size="xs" mt={2} c="yellow">
                            {formatDate(log.create_at, true)}
                          </Text>
                        </Timeline.Item>
                      ))
                    ) : (
                      <Timeline.Item
                        bullet={<IconUser size={12} />}
                        title={`${overtimeData.logs.admin}`}
                      >
                        <Text c="dimmed" size="sm">
                          {overtimeData.logs.message}
                        </Text>
                        <Text size="xs" mt={2} c="blue">
                          {formatDate(overtimeData.logs.create_at, true)}
                        </Text>
                      </Timeline.Item>
                    )}
                  </>
                )}
              </Timeline>

              {/* Show message if no logs exist */}
              {!overtimeData.logs && (
                <Text c="dimmed" mt="md" className="text-center">
                  No activity logs available
                </Text>
              )}
            </ScrollArea.Autosize>
          </Grid.Col>
          <Grid.Col span={12} mt="lg">
            <Group justify="flex-end" gap="sm">
              {isEditing && overtimeData?.is_approved === "pending" ? (
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
                <>
                  <Button
                    variant="filled"
                    color="red"
                    onClick={handleDeleteOvertime}
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
                </>
              )}
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Card>
  );
};

export default OvertimeDetail;
