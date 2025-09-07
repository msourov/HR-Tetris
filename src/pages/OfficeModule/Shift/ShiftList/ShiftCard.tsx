import { Badge, Card, Text } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import { Shift } from "../../../../features/types/shift";

interface ShiftCardProps {
  shift: Shift;
}

const ShiftCard = ({ shift }: ShiftCardProps) => {
  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    // Handle strings like "22:00:00"
    const [hours, minutes] = timeString.split(":").map(Number);

    const h = hours % 12 || 12; // 0 → 12
    const ampm = hours >= 12 ? "PM" : "AM";

    return `${h}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      {/* Header with status indicator */}
      <div className="flex justify-between items-center mb-2">
        <Text className="text-gray-800 text-lg">{shift.name}</Text>
        <div className="flex items-center gap-2">
          <Badge
            color={shift.regular ? "orange" : "blue"}
            variant="light"
            size="sm"
            className="font-medium"
          >
            {shift.regular ? "Regular" : "Temporary"}
          </Badge>
          <div
            className={`w-2 h-2 rounded-full ${
              shift.active ? "bg-green-500" : "bg-gray-400"
            }`}
            title={shift.active ? "Active" : "Inactive"}
          ></div>
        </div>
      </div>

      {/* Description */}
      {shift.descriptions && (
        <Text size="sm" className="text-gray-600 mb-4">
          {shift.descriptions}
        </Text>
      )}

      {/* Time information */}
      <div className="space-y-2 mb-4">
        {/* Shift Period - Always shown for both types */}
        <div className="flex items-center gap-3">
          {/* <IconCalendar size={16} className="text-blue-500 flex-shrink-0" /> */}
          <div className="flex justify-between w-full">
            <Text size="sm" className="text-gray-500 font-medium">
              Duration:
            </Text>
            <Text className="text-gray-900 w-[65%]">
              {dayjs(shift.start_time).format("MMM D, YYYY")} -{" "}
              {dayjs(shift.end_time).format("MMM D, YYYY")}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <IconClock size={16} className="text-blue-500 flex-shrink-0" /> */}
          <div className="flex justify-between w-full">
            <Text size="sm" className="text-gray-500 font-medium">
              Work Hours:
            </Text>
            <Text className="text-gray-900 w-[65%]">
              {formatTime(shift.day_start_time)} -{" "}
              {formatTime(shift.day_end_time)}
            </Text>
          </div>
        </div>

        {/* Off days */}
        {shift.off_day && shift.off_day.length > 0 && (
          <div className="flex items-center gap-3">
            {/* <IconZzz size={16} className="text-red-800 flex-shrink-0" /> */}
            <div className="flex justify-between w-full">
              <Text size="sm" className="text-gray-500 font-medium">
                Off Days:
              </Text>
              <Text className="text-red-800  w-[65%]">
                {shift.off_day.join(", ")}
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-500">
        <div className="flex items-center gap-1 text-gray-500">
          <IconCalendar size={14} />
          <Text size="sm">
            Created: {dayjs(shift.create_at).format("MMM D, YYYY")}
          </Text>
        </div>

        {/* {shift.update_at && (
          <Text size="sm" className="text-gray-500">
            Updated: {dayjs(shift.update_at).format("MMM D, YYYY")}
          </Text>
        )} */}
      </div>
    </Card>
  );
};

export default ShiftCard;
