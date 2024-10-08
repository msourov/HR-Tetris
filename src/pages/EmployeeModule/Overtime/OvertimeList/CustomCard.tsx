import { Card, Text, Badge } from "@mantine/core";
import { OvertimeData } from "../../../../features/api/types";
const CustomCard = ({
  employee_id,
  purpose,
  start_time,
  end_time,
  is_approved,
}: OvertimeData) => {
  return (
    <Card className="w-full py-2 px-4 border border-gray-200 rounded-lg shadow-lg flex flex-col min-h-[250px]">
      <Text className="text-lg font-semibold">Employee ID: {employee_id}</Text>
      <Text className="mt-2 text-gray-600">Purpose: {purpose}</Text>
      <Text className="mt-2 text-gray-600">
        Start Time: {new Date(start_time).toLocaleString()}
      </Text>
      <Text className="mt-2 text-gray-600">
        End Time: {new Date(end_time).toLocaleString()}
      </Text>
      <Badge
        className="mt-4"
        color={
          is_approved === "approve"
            ? "green"
            : is_approved === "reject"
            ? "red"
            : "yellow"
        }
      >
        {is_approved.charAt(0).toUpperCase() + is_approved.slice(1)}
      </Badge>
    </Card>
  );
};

export default CustomCard;
