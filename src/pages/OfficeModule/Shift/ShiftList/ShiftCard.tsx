import { Badge, Card, Group, Text } from "@mantine/core";
import { Shift } from "../../../../features/api/types";

interface ShiftCardProps {
  shift: Shift;
}
const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group style={{ marginBottom: 5 }}>
        <Text fw={500}>{shift.name}</Text>
        <Badge color={shift.active ? "green" : "red"}>
          {shift.active ? "Active" : "Inactive"}
        </Badge>
      </Group>

      <Text size="sm" style={{ lineHeight: 1.5 }}>
        {shift.descriptions}
      </Text>

      <Group style={{ marginTop: 15 }}>
        <Text size="xs">Start: {shift.start_time}</Text>
        <Text size="xs">End: {shift.end_time}</Text>
      </Group>

      {/* <Text size="xs" style={{ marginTop: 10 }}>
        Logs: {shift.logs.length}
      </Text> */}
    </Card>
  );
};

export default ShiftCard;
