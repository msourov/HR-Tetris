import {
  Card,
  Avatar,
  Group,
  Text,
  Badge,
  Progress,
  Stack,
  Box,
  Divider,
  ActionIcon,
  Tooltip,
  Collapse,
  ThemeIcon,
  Flex,
} from "@mantine/core";
import {
  IconMessage,
  IconClock,
  IconCalendar,
  IconChevronRight,
  IconPaperclip,
  IconChecklist,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import { TaskResponse } from "../../../../features/types/task";
import { getImageUrl } from "../../../../services/utils/getImageUrl";

const TaskCard = ({ task }: { task: TaskResponse }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isOverdue = dayjs().isAfter(task.due_date);
  const timeProgress = (task.actual_time_spent / task.estimated_time) * 100;

  return (
    <Card
      withBorder
      radius="lg"
      // className="w-full max-w-[300px] hover:shadow-sm transition-shadow bg-gradient-to-br from-gray-50/50 to-white"
      className="w-full hover:shadow-md transition-all duration-200 bg-white relative"
    >
      {/* Card Header */}
      <Group justify="space-end" mb="sm">
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <ThemeIcon
                variant="gradient"
                gradient={{
                  from:
                    task.priority === "high"
                      ? "#ff6b6b"
                      : task.priority === "medium"
                      ? "#f59f00"
                      : "#51cf66",
                  to:
                    task.priority === "high"
                      ? "#c92a2a"
                      : task.priority === "medium"
                      ? "#e67700"
                      : "#2f9e44",
                  deg: 135,
                }}
                size={28}
                radius="xl"
              >
                <IconChecklist size={16} />
              </ThemeIcon>
              <Text fz="md" fw={600} className="truncate">
                {task?.name}
              </Text>
            </div>
            <div className="flex items-center gap-1">
              <Text
                fz="xs"
                fw={600}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color:
                    task.priority === "high"
                      ? "#c92a2a"
                      : task.priority === "medium"
                      ? "#e67700"
                      : "#2f9e44",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      task.priority === "high"
                        ? "#c92a2a"
                        : task.priority === "medium"
                        ? "#e67700"
                        : "#2f9e44",
                    display: "inline-block",
                  }}
                />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="transform transition-transform"
                style={{ rotate: detailsOpen ? "90deg" : "0deg" }}
              >
                <IconChevronRight size={20} />
              </ActionIcon>
            </div>
          </div>

          <Text c="dimmed" fz="sm" className="line-clamp-2 mt-2">
            {task?.description}
          </Text>
        </div>
      </Group>

      {/* Status Bar */}
      <Flex gap={6} mb="sm" align="center">
        <Badge
          variant="light"
          color={
            task?.status === "hold"
              ? "orange"
              : task.status === "in-progress"
              ? "blue"
              : "gray"
          }
          radius="sm"
          leftSection={
            <Box
              w={6}
              h={6}
              bg={
                task?.status === "hold"
                  ? "orange"
                  : task.status === "in-progress"
                  ? "blue"
                  : "gray"
              }
              mr={4}
            />
          }
        >
          {task.status}
        </Badge>

        {isOverdue && (
          <Badge variant="dot" color="red" radius="sm">
            Overdue
          </Badge>
        )}
      </Flex>

      {/* Collapsible Details */}
      <Collapse in={detailsOpen}>
        <Divider mb="md" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Text fz="xs" c="dimmed" mb={2}>
              Start Date
            </Text>
            <Group gap={4}>
              <IconCalendar size={14} />
              <Text fz="sm">
                {dayjs(task.start_date).format("MMM D, YYYY")}
              </Text>
            </Group>
          </div>

          <div>
            <Text fz="xs" c="dimmed" mb={2}>
              Due Date
            </Text>
            <Group gap={4}>
              <IconCalendar size={14} />
              <Text fz="sm" c={isOverdue ? "red" : undefined}>
                {dayjs(task.due_date).format("MMM D, YYYY")}
              </Text>
            </Group>
          </div>

          <div>
            <Text fz="xs" c="dimmed" mb={2}>
              Time Tracking
            </Text>
            <Group gap={4}>
              <IconClock size={14} />
              <Text fz="sm">
                {task.actual_time_spent}h / {task.estimated_time}h
              </Text>
            </Group>
          </div>

          <div>
            <Text fz="xs" c="dimmed" mb={2}>
              Progress
            </Text>
            <Progress.Root size={12} radius="xl">
              <Progress.Section
                value={timeProgress}
                color={timeProgress > 100 ? "red" : "blue"}
                style={{ borderRadius: "20px" }}
              />
            </Progress.Root>
          </div>
        </div>

        {/* Assignees */}
        <Box mb="md">
          <Text fz="xs" c="dimmed" mb={4}>
            Assignees
          </Text>
          <Avatar.Group spacing="sm">
            {task.assignees.map((assignee) => (
              <Tooltip key={assignee?.employee_id} label={assignee.name}>
                <Avatar
                  size={32}
                  radius="xl"
                  src={getImageUrl(assignee.employee_id)}
                  color="blue"
                  className="transition-transform hover:scale-110 cursor-pointer"
                >
                  {assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </Box>

        {/* Activity Timeline */}
        <Box>
          <Text fz="xs" c="dimmed" mb={4}>
            Recent Activity
          </Text>
          <Stack gap={6}>
            {/* {task.logs.slice(0, 2).map((log, index) => (
              <Group key={index} gap={8} align="flex-start">
                <ThemeIcon variant="light" size={24} radius="xl" color="gray">
                  <IconChartBubble size={14} />
                </ThemeIcon>
                <div>
                  <Text fz="sm" lineClamp={1}>
                    {log.message || "Update"}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {dayjs(log.create_at || log.updated_at).fromNow()}
                  </Text>
                </div>
              </Group>
            ))}
            {task.logs.length > 2 && (
              <Text fz="xs" c="blue" className="cursor-pointer hover:underline">
                Show {task.logs.length - 2} more activities
              </Text>
            )} */}
          </Stack>
        </Box>
      </Collapse>

      {/* Footer */}
      <Group justify="space-between" mt="sm">
        <Group gap={6}>
          <ActionIcon variant="transparent" color="gray" size="sm">
            <IconMessage size={16} />
            <Text fz="xs" ml={2}>
              {task?.comments.length}
            </Text>
          </ActionIcon>

          <ActionIcon variant="transparent" color="gray" size="sm">
            <IconPaperclip size={16} />
            <Text fz="xs" ml={2}>
              {task?.attachments.length}
            </Text>
          </ActionIcon>
        </Group>

        <Tooltip label={`Reported by ${task?.reporter?.name ?? "Unknown"}`}>
          <Avatar
            size={28}
            radius="xl"
            src={null}
            color="cyan"
            className="border-2 border-white shadow-sm"
          >
            {task?.reporter?.name
              ? task.reporter.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "N/A"}
          </Avatar>
        </Tooltip>
      </Group>
    </Card>
  );
};

export default TaskCard;
