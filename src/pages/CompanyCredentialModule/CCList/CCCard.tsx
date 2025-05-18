import {
  Badge,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconBell,
  IconCalendar,
  IconCheck,
  IconPhone,
} from "@tabler/icons-react";
import { CompanyCredential } from "../../../features/types/companyCredentials";
import useFormatDate from "../../../services/utils/useFormatDate";

export default function CertificateCard({ item }: { item: CompanyCredential }) {
  const { formatDate } = useFormatDate();

  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <Title order={3}>{item.name}</Title>
          <Badge
            color={item.active ? "teal" : "red"}
            variant="light"
            leftSection={
              item.active ? (
                <IconCheck size={14} />
              ) : (
                <IconAlertCircle size={14} />
              )
            }
          >
            {item.active ? "Active" : "Expired"}
          </Badge>
        </Group>
        <Group gap="xs">
          <IconCalendar size={18} color="blue" />
          <Text fw={500}>
            <Text fw={500}>Expires: {formatDate(item.expire_at)}</Text>
          </Text>
        </Group>
      </Group>

      <Text c="dimmed" mb="md">
        {item.descriptions}
      </Text>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="xs">
            <Group gap="xs">
              <IconPhone size={16} />
              <Text fw={500}>Contacts to Notify:</Text>
            </Group>
            <Flex gap="sm" wrap="wrap">
              {item.notify_mobile.map((num) => (
                <Badge key={num} variant="outline" color="blue">
                  {num}
                </Badge>
              ))}
            </Flex>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="xs">
            <Group gap="xs">
              <IconBell size={16} />
              <Text fw={500}>Get Notified Days Before:</Text>
            </Group>
            <Flex gap="sm" wrap="wrap">
              {item.notify_b_days.map((day) => (
                <Badge key={day} variant="dot" color="orange">
                  {day} days
                </Badge>
              ))}
            </Flex>
          </Stack>
        </Grid.Col>
      </Grid>

      <Divider my="md" />

      <Group justify="space-between" c="dimmed" fz="sm">
        <Text>Created: {formatDate(item.create_at, true)}</Text>
        <Text>Updated: {formatDate(item.update_at, true)}</Text>
      </Group>
    </Card>
  );
}
