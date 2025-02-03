import { Card, Group, Text, Badge, Button } from "@mantine/core";
import { IconClock, IconCalendar, IconSunOff } from "@tabler/icons-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import { Shift } from "../../../../features/types/shift";
import { IoIosEye } from "react-icons/io";

interface ShiftCardProps {
  shift: Shift;
}

const ShiftCard = ({ shift }: ShiftCardProps) => {
  const calculateDuration = (
    start: string,
    end: string,
    isRegular: boolean
  ) => {
    const format = isRegular ? "HH:mm:ss" : undefined;
    const startTime = dayjs(start, format);
    const endTime = dayjs(end, format);
    const diff = dayjs.duration(endTime.diff(startTime));
    return `${diff.hours()}h ${diff.minutes()}m`;
  };

  const timeFormat = shift.regular ? "HH:mm" : "MMM D, YYYY HH:mm";

  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      className="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between bg-gray-50"
    >
      {/* Header */}
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">
          {shift.name}
        </Text>
        <Group gap="xs">
          <Badge color={shift.active ? "teal" : "red"} variant="filled">
            {shift.active ? "Active" : "Inactive"}
          </Badge>
          <Badge color="indigo" variant="light">
            {shift.regular ? "Regular" : "Temporary"}
          </Badge>
        </Group>
      </Group>

      {/* Description */}
      {shift.descriptions && (
        <Text c="dimmed" size="sm" mb="md">
          {shift.descriptions}
        </Text>
      )}

      {/* Details */}
      <div className="flex flex-col gap-3 flex-1">
        <Group gap="xs" className="text-blue-400">
          <IconClock size={18} className="text-blue-500" />
          <Text size="sm">
            {shift.regular ? (
              <>
                Daily: {dayjs(shift.start_time).format("MMM D / YYYY")} -{" "}
                {dayjs(shift.end_time).format()}
                <Text span c="dimmed" mx={4}>
                  (
                  {calculateDuration(
                    shift.day_start_time,
                    shift.day_end_time,
                    true
                  )}
                  )
                </Text>
              </>
            ) : (
              <>
                {dayjs(shift.start_time).format(timeFormat)} -{" "}
                {dayjs(shift.end_time).format(timeFormat)}
                <Text span c="dimmed" mx={4}>
                  ({calculateDuration(shift.start_time, shift.end_time, false)})
                </Text>
              </>
            )}
          </Text>
        </Group>

        {shift.off_day && (
          <Group gap="xs">
            <IconSunOff size={18} className="text-orange-500" />
            <Text size="sm">
              Off day: <span className="text-yellow-600">{shift.off_day}</span>
            </Text>
          </Group>
        )}
      </div>

      <Group justify="space-between" mt="md">
        <Group gap="xs">
          <IconCalendar size={18} className="text-purple-500" />
          <Text size="sm" c="dimmed">
            Created: {dayjs(shift.create_at).format("MMM D, YYYY")}
          </Text>
        </Group>
        <Button
          variant="light"
          color="blue"
          size="compact-md"
          className="font-thin transition-colors hover:bg-blue-600 hover:text-white"
        >
          <IoIosEye size={20} />
          {/* View */}
        </Button>
      </Group>
    </Card>
  );
};

export default ShiftCard;
