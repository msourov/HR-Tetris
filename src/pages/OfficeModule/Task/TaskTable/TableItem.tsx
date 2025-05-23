import { ActionIcon, Avatar, Badge, Group, Table, Text } from "@mantine/core";
import {
  IconAlertCircle,
  IconClock,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { TaskResponse } from "../../../../features/types/task";

type TaskItemProps = {
  item: TaskResponse;
  index: number;
};

const TableItem: React.FC<TaskItemProps> = ({ item, index }) => {
  const { formatDate } = useFormatDate();

  const getPriorityColor = () => {
    switch (item.priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case "in-progress":
        return "blue";
      case "hold":
        return "yellow";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Table.Tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td className="pl-6 py-4">
        <div className="flex items-center gap-3">
          <Text fw={500} className="text-gray-900">
            {item.name}
          </Text>
          <Text size="sm" className="text-gray-500 line-clamp-2">
            {item.description}
          </Text>
        </div>
      </Table.Td>

      <Table.Td className="py-4">
        <Avatar.Group spacing="sm">
          {item.assignees.map((assignee, idx) => (
            <Avatar
              key={idx}
              size="md"
              radius="xl"
              color="blue"
              variant="outline"
              title={assignee?.name}
            >
              {assignee?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Avatar>
          ))}
        </Avatar.Group>
      </Table.Td>

      <Table.Td className="py-4">
        <Group gap="sm">
          <Avatar size="md" radius="xl" color="cyan">
            {item.reporter?.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <div>
            <Text fw={500}>{item.reporter?.name}</Text>
            <Text size="sm" className="text-gray-500">
              {item.reporter?.designation}
            </Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td className="py-4">
        <Badge
          color={getPriorityColor()}
          variant="light"
          leftSection={<IconAlertCircle size="1rem" className="mr-1" />}
        >
          {item.priority}
        </Badge>
      </Table.Td>

      <Table.Td className="py-4">
        <Badge
          color={getStatusColor()}
          variant="outline"
          radius="sm"
          className="uppercase tracking-wide"
        >
          {item.status}
        </Badge>
      </Table.Td>

      <Table.Td className="py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <IconClock size="1rem" className="text-gray-400" />
            <span className="text-gray-700">
              {formatDate(item.start_date, true)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconClock size="1rem" className="text-gray-400" />
            <span className="text-gray-700">
              {formatDate(item.due_date, true)}
            </span>
          </div>
        </div>
      </Table.Td>

      <Table.Td className="pr-6 py-4">
        <Group gap={4} justify="right">
          <ActionIcon color="blue" variant="subtle">
            <IconPencil size="1.25rem" />
          </ActionIcon>
          <ActionIcon color="red" variant="subtle">
            <IconTrash size="1.25rem" />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

export default TableItem;
