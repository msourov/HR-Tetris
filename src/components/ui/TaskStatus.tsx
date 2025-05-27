import { Pill } from "@mantine/core";
import {
  IconClock,
  IconPlayerPlay,
  IconCheck,
  IconCircleX,
  IconPlayerPause,
  IconListDetails,
} from "@tabler/icons-react";

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: "Pending",
    color: "yellow",
    bg: "bg-yellow-100",
    icon: <IconClock size={16} />,
  },
  "in-progress": {
    label: "In Progress",
    color: "blue",
    bg: "bg-blue-100",
    icon: <IconPlayerPlay size={16} />,
  },
  completed: {
    label: "Completed",
    color: "green",
    bg: "bg-green-100",
    icon: <IconCheck size={16} />,
  },
  backlog: {
    label: "Backlog",
    color: "gray",
    bg: "bg-gray-200",
    icon: <IconListDetails size={16} />,
  },
  hold: {
    label: "On Hold",
    color: "orange",
    bg: "bg-orange-100",
    icon: <IconPlayerPause size={16} />,
  },
};

const TaskStatus = ({ status }: { status: string }) => {
  const config = statusConfig[status] ?? {
    label: "Unknown",
    color: "red",
    bg: "bg-red-100",
    icon: <IconCircleX size={16} />,
  };

  return (
    <Pill size="sm" c={config.color} className={config.bg}>
      <div className="flex items-center gap-1">
        <span>{config.icon}</span>
        {config.label}
      </div>
    </Pill>
  );
};

export default TaskStatus;
