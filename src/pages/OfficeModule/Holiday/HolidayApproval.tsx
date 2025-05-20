import { Button, Card, Group, Stack, Text } from "@mantine/core";
import useFormatDate from "../../../services/utils/useFormatDate";
import { Holiday } from "../../../features/types/holiday";

const HolidayApproval = ({ holidays }: { holidays: Holiday[] }) => {
  const { formatDate } = useFormatDate();

  return (
    <Stack gap="md">
      {holidays.map((holiday) => (
        <Card key={holiday.uid} withBorder shadow="xs" p="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={600} size="md">
                {holiday.name}
              </Text>
              <Text size="sm" c="dimmed">
                {formatDate(holiday.holiday_start_at)} -{" "}
                {formatDate(holiday.holiday_end_at)}
              </Text>
            </div>
            <Group>
              <Button size="xs" color="green">
                Approve
              </Button>
              <Button size="xs" color="red">
                Reject
              </Button>
            </Group>
          </Group>
        </Card>
      ))}
    </Stack>
  );
};

export default HolidayApproval;
