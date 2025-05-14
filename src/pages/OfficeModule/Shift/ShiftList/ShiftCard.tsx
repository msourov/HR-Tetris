import { Card, Text, Badge } from "@mantine/core";
import { IconClock, IconCalendar, IconSunOff } from "@tabler/icons-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import { Shift } from "../../../../features/types/shift";

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
      padding="md"
      radius="lg"
      withBorder
      className="hover:shadow-lg transition-all duration-200 flex flex-col justify-between bg-white"
      shadow="sm"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-start">
          <Text fw={700} size="lg" className="text-gray-800">
            {shift.name}
          </Text>
          <Badge
            color={shift.active ? "green" : "gray"}
            variant="light"
            radius="sm"
            size="sm"
          >
            {shift.active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {shift.descriptions && (
          <Text size="sm" className="text-gray-600">
            {shift.descriptions}
          </Text>
        )}
      </div>

      {/* Time Details */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <IconClock size={20} className="text-blue-600" />
          <div className="flex flex-col">
            <Text size="sm" fw={500} className="text-gray-700">
              {shift.regular ? (
                <>
                  Daily Schedule ·{" "}
                  {calculateDuration(
                    shift.day_start_time,
                    shift.day_end_time,
                    true
                  )}
                </>
              ) : (
                <>
                  {dayjs(shift.start_time).format(timeFormat)} –{" "}
                  {dayjs(shift.end_time).format(timeFormat)}
                </>
              )}
            </Text>
            <Text size="xs" className="text-gray-500">
              {shift.regular ? (
                <>
                  {dayjs(shift.start_time).format("MMM D / YYYY")} –{" "}
                  {dayjs(shift.end_time).format("MMM D / YYYY")}
                </>
              ) : (
                `Duration: ${calculateDuration(
                  shift.start_time,
                  shift.end_time,
                  false
                )}`
              )}
            </Text>
          </div>
        </div>

        {shift.off_day && (
          <div className="flex items-center gap-2">
            <IconSunOff size={20} className="text-orange-600" />
            <div>
              <Text size="sm" className="text-gray-700">
                Off Day:
                <span className="ml-1 font-medium text-gray-900">
                  {shift.off_day}
                </span>
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-3">
        <div className="flex items-center gap-2">
          <IconCalendar size={18} className="text-gray-500" />
          <Text size="xs" className="text-gray-600">
            Created {dayjs(shift.create_at).format("MMM D, YYYY")}
          </Text>
        </div>

        <Badge
          variant="outline"
          color="indigo"
          radius="sm"
          className="border-indigo-100 bg-indigo-50"
        >
          {shift.regular ? "Regular Shift" : "Temporary Shift"}
        </Badge>
      </div>
    </Card>
  );
};

export default ShiftCard;
