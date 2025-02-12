import {
  Card,
  Badge,
  Group,
  Text,
  Stack,
  Loader,
  Grid,
  Divider,
} from "@mantine/core";
import useFormatDate from "../../../services/utils/useFormatDate";
import { useGetAttendanceDetailQuery } from "../../../features/api/attendanceSlice";
import {
  IconAlertCircle,
  IconClock,
  IconHome,
  IconMapPin,
} from "@tabler/icons-react";

const AttendanceDetail = ({ uid }: { uid: string }) => {
  const { formatDate } = useFormatDate();
  const { data, isLoading, error } = useGetAttendanceDetailQuery({ uid });

  const attendanceData = data?.data
    ? Array.isArray(data.data)
      ? data.data[0]
      : data.data
    : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader type="dots" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <IconAlertCircle />
        <Text>Failed to load attendance details</Text>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <IconAlertCircle />
        <Text>No attendance record found</Text>
      </div>
    );
  }

  const statusColor = attendanceData.is_attend
    ? attendanceData.is_late
      ? "yellow"
      : "green"
    : "red";

  const statusText = attendanceData.is_attend
    ? attendanceData.is_late
      ? "Late"
      : "Present"
    : "Absent";

  const attendanceType =
    attendanceData.is_home_office === null
      ? "Office"
      : attendanceData.is_home_office
      ? "Home Office"
      : "Office";

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      className="bg-white border border-gray-200"
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text size="xl" fw={700} className="text-gray-800">
            Attendance Details
          </Text>
          <Badge
            color={statusColor}
            variant="light"
            size="lg"
            radius="sm"
            className="tracking-wide"
          >
            {statusText}
          </Badge>
        </Group>

        <Divider />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="xs">
              <div className="flex items-center gap-2 text-gray-600">
                <IconClock size={18} />
                <Text fw={500}>Time Details</Text>
              </div>

              <div className="space-y-1 pl-7">
                <div>
                  <Text size="sm" c="dimmed">
                    Start Time
                  </Text>
                  <Text>
                    {formatDate(attendanceData.start_attended_date, true)}
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    End Time
                  </Text>
                  <Text>
                    {attendanceData.end_attended_time
                      ? formatDate(attendanceData.end_attended_time, true)
                      : "-"}
                  </Text>
                </div>
              </div>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="xs">
              <div className="flex items-center gap-2 text-gray-600">
                <IconHome size={18} />
                <Text fw={500}>Work Details</Text>
              </div>

              <div className="space-y-1 pl-7">
                <div>
                  <Text size="sm" c="dimmed">
                    Employee ID
                  </Text>
                  <Text className="font-mono">
                    {attendanceData.employee_id}
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    Type
                  </Text>
                  <Text className="capitalize">
                    {attendanceType.toLowerCase()}
                  </Text>
                </div>
              </div>
            </Stack>
          </Grid.Col>

          <Grid.Col span={12}>
            <Stack gap="xs">
              <div className="flex items-center gap-2 text-gray-600">
                <IconMapPin size={18} />
                <Text fw={500}>Device Information</Text>
              </div>

              <div className="space-y-1 pl-7">
                <div>
                  <Text size="sm" c="dimmed">
                    IP Address
                  </Text>
                  <Text className="font-mono">
                    {attendanceData.ip_address || "-"}
                  </Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">
                    MAC Address
                  </Text>
                  <Text className="font-mono">
                    {attendanceData.mac_address || "-"}
                  </Text>
                </div>
              </div>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Card>
  );
};

export default AttendanceDetail;
