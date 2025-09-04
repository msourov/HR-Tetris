import { Text } from "@mantine/core";
import { IconClock, IconCalendar, IconZzz } from "@tabler/icons-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import { Shift } from "../../../../features/types/shift";
import CardGlass from "../../../../components/ui/CardGlass";

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
    <CardGlass className="hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-start">
          <Text className="text-gray-700 text-lg font-semibold">
            {shift.name}
          </Text>
          {/* <Badge
            color={shift.active ? "green" : "gray"}
            variant="light"
            radius="sm"
            size="sm"
          >
            {shift.active ? "Active" : "Inactive"}
          </Badge> */}
          <div
            className={`w-[7px] h-[7px] rounded-full ${
              shift?.active ? "bg-green-500" : "bg-gray-700"
            }`}
          ></div>
        </div>

        {shift.descriptions && (
          <Text
            size="sm"
            className="text-gray-600 w-fit px-2 shadow-sm rounded-md"
          >
            {shift.descriptions}
          </Text>
        )}
      </div>

      {/* Time Details */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2">
          <IconClock size={18} className="text-gray-400" />
          <div className="flex flex-col">
            <Text fw={500} className="text-gray-700">
              {shift.regular ? (
                <>
                  <span className="text-xs font-semibold">
                    {" "}
                    Daily Schedule ·{" "}
                  </span>

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
            <Text className="text-gray-500">
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

        {shift.off_day && shift.off_day.length > 0 && (
          <div className="flex items-center gap-2">
            <IconZzz size={18} className="font-thin text-gray-400" />
            <div>
              <Text className="text-gray-600">
                <span className="text-xs">Weekend:</span>
                <span className="ml-1 font-medium text-gray-700">
                  {shift.off_day.join(", ")}
                </span>
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t pt-3">
        <div className="flex items-center gap-2">
          <IconCalendar size={18} className="text-amber-700" />
          <Text className="text-amber-700">
            Created {dayjs(shift.create_at).format("MMM D, YYYY")}
          </Text>
        </div>

        <div
          className={`border-blue-100 px-1 rounded-lg bg-blue-50 ${
            shift?.regular && "text-amber-600 bg-amber-200"
          }`}
        >
          {shift.regular ? "Regular Shift" : "Temporary Shift"}
        </div>
      </div>
    </CardGlass>
  );
};

export default ShiftCard;
