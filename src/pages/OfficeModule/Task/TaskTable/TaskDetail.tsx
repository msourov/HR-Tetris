import {
  Card,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Divider,
  Grid,
  Progress,
  ThemeIcon,
  Avatar,
  Box,
  Button,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconProgressCheck,
} from "@tabler/icons-react";
import { useGetTaskDetailQuery } from "../../../../features/api/taskSlice";
import useFormatDate from "../../../../services/utils/useFormatDate";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import TaskStatus from "../../../../components/ui/TaskStatus";
import ErrorAlert from "../../../../components/shared/ErrorAlert";

export function TaskDetails({
  uid,
  closeModal,
}: {
  uid: string;
  closeModal?: () => void;
}) {
  const { data, isLoading, error } = useGetTaskDetailQuery({ uid });
  const { formatDate } = useFormatDate();
  dayjs.extend(relativeTime);

  const task = data?.data;

  const timeDifference = task
    ? task.actual_time_spent - task.estimated_time
    : 0;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    type ErrorWithDetail = { data?: { detail?: string } };
    const err = error as ErrorWithDetail;
    const errorMessage =
      err.data && typeof err.data === "object" && "detail" in err.data
        ? err.data.detail
        : "Error fetching task details";
    return <ErrorAlert message={errorMessage || ""} />;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Header Section */}
        <Group justify="space-between" wrap="nowrap">
          <Title order={2} lineClamp={1}>
            {task?.name || "Untitled Task"}
          </Title>
          <div className="flex flex-col items-end justify-end gap-2">
            <Badge
              color={
                task?.priority === "high"
                  ? "red"
                  : task?.priority === "medium"
                  ? "orange"
                  : "green"
              }
            >
              {task?.priority} priority
            </Badge>
            {task?.status && <TaskStatus status={task.status} />}
          </div>
        </Group>

        {task?.description && (
          <Text c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
            {task.description}
          </Text>
        )}

        <Divider />

        {/* Main Content Grid */}
        <Grid gutter="xl">
          {/* Left Column */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              {/* Assignees Section */}
              <Group gap="sm" align="flex-start">
                <ThemeIcon variant="transparent" color="gray" mt={3}>
                  <IconUser size={18} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" c="dimmed" mb={4}>
                    Assignees
                  </Text>
                  {task?.assignees?.map((assignee, index) => (
                    <Group key={index} gap="sm" mb={6} wrap="nowrap">
                      <Avatar size="sm" color="blue" radius="xl">
                        {getInitials(assignee.name)}
                      </Avatar>
                      <Box>
                        <Text size="sm" fw={500}>
                          {assignee.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {assignee.designation}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                  {!task?.assignees?.length && (
                    <Text size="sm">No assignees</Text>
                  )}
                </Box>
              </Group>

              {/* Reporter Section */}
              <Group gap="sm" align="flex-start">
                <ThemeIcon variant="transparent" color="gray" mt={3}>
                  <IconProgressCheck size={18} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" c="dimmed" mb={4}>
                    Reporter
                  </Text>
                  <Group gap="sm" wrap="nowrap">
                    <Avatar size="sm" color="cyan" radius="xl">
                      {getInitials(task?.reporter?.name)}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={500}>
                        {task?.reporter?.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {task?.reporter?.designation}
                      </Text>
                    </Box>
                  </Group>
                </Box>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              {/* Dates Section */}
              <Group gap="sm" align="flex-start">
                <ThemeIcon variant="transparent" color="gray" mt={3}>
                  <IconCalendar size={18} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" c="dimmed" mb={4}>
                    Dates
                  </Text>
                  <Stack gap={2}>
                    <Group gap={6}>
                      <Text size="sm" fw={500} w={60}>
                        Start:
                      </Text>
                      <Text size="sm">
                        {task?.start_date
                          ? formatDate(task.start_date, true)
                          : "N/A"}
                      </Text>
                    </Group>
                    <Group gap={6}>
                      <Text size="sm" fw={500} w={60}>
                        Due:
                      </Text>
                      <Text size="sm">
                        {task?.due_date
                          ? formatDate(task.due_date, true)
                          : "N/A"}
                      </Text>
                    </Group>
                  </Stack>
                </Box>
              </Group>

              {/* Time Tracking */}
              <Group gap="sm" align="flex-start">
                <ThemeIcon variant="transparent" color="gray" mt={3}>
                  <IconClock size={18} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" c="dimmed" mb={4}>
                    Time Tracking
                  </Text>
                  <Group gap="md" align="center">
                    <Stack gap={2}>
                      <Group gap={6}>
                        <Text size="sm" fw={500} w={80}>
                          Estimated:
                        </Text>
                        <Text size="sm">{task?.estimated_time || 0}h</Text>
                      </Group>
                      <Group gap={6}>
                        <Text size="sm" fw={500} w={80}>
                          Actual:
                        </Text>
                        <Text size="sm">{task?.actual_time_spent || 0}h</Text>
                      </Group>
                    </Stack>
                    <Progress.Root
                      size={24}
                      w={120}
                      style={{ position: "relative" }}
                    >
                      <Progress.Section
                        value={
                          task?.estimated_time && task.actual_time_spent
                            ? Math.min(
                                (task.actual_time_spent / task.estimated_time) *
                                  100,
                                100
                              )
                            : 0
                        }
                        color={timeDifference > 0 ? "red" : "teal"}
                      >
                        <Progress.Label
                          style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "var(--mantine-color-white)",
                            zIndex: 1,
                          }}
                        >
                          {Math.abs(timeDifference)}h{" "}
                          {timeDifference > 0 ? "over" : "under"}
                        </Progress.Label>
                      </Progress.Section>
                    </Progress.Root>
                  </Group>
                </Box>
              </Group>

              {/* Status Section */}
              <Group gap="sm" align="center">
                <Text size="sm" c="dimmed">
                  Created {dayjs(task?.created_at).fromNow()}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Logs Section */}
        {(task?.logs?.length ?? 0) > 0 && (
          <>
            <Divider />
            <Group gap="xs" wrap="nowrap" align="center">
              <Text size="sm" c="dimmed">
                Last action:
              </Text>
            </Group>
          </>
        )}
      </Stack>
      <Button className="mt-8" color="blue" onClick={closeModal}>
        Close
      </Button>
    </Card>
  );
}

// Helper function for avatar initials
function getInitials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
