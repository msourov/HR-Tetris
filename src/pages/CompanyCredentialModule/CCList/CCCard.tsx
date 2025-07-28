import {
  Badge,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowRight,
  IconBell,
  IconCalendar,
  IconCheck,
  IconPhone,
} from "@tabler/icons-react";
import { CompanyCredential } from "../../../features/types/companyCredentials";
import useFormatDate from "../../../services/utils/useFormatDate";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../../components/ui/AppModal";
import { CertificateDetail } from "./CCDetail";
import dayjs from "dayjs";

export default function CertificateCard({ item }: { item: CompanyCredential }) {
  const { formatDate } = useFormatDate();
  const [opened, { open, close }] = useDisclosure(false);
  // const { data, isLoading, error } = useGetCredentialDetailQuery({
  //   uid: item?.uid,
  // });

  const handlePolicyView = () => {
    open();
  };

  return (
    <Card withBorder radius="md" padding={0} className="pt-3">
      <div className="px-6 ">
        <Group justify="space-between" mb="sm">
          <Group gap="sm">
            <Text className="text-lg">{item.name}</Text>
            <Badge
              color={item.active ? "green" : "red"}
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
          <Group gap="0.25rem" className="text-sm">
            <IconCalendar size={18} color="blue" />
            <Text className="font-semibold text-gray-600">
              Expires:{" "}
              <Text
                span
                className={`font-semibold ${
                  dayjs(item?.expire_at).isBefore(dayjs())
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {formatDate(item.expire_at)}
              </Text>
            </Text>
          </Group>
        </Group>

        <Text
          c="dimmed"
          mb="md"
          className="truncate whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {item.descriptions}
        </Text>

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xs">
              <div className="flex gap-1 items-center">
                <IconPhone size={16} />
                <Text fw={500} className="text-sm font-bold">
                  Contacts to Notify:
                </Text>
              </div>
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
              <div className="flex gap-1 items-center">
                <IconBell size={16} />
                <Text fw={500} className="text-sm font-bold">
                  Get Notified Days Before:
                </Text>
              </div>
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
        <Group justify="space-between" c="dimmed" fz="sm" className="mt-4">
          <Text className="text-xs">
            Created: {formatDate(item.create_at, true)}
          </Text>
          <Text className="text-xs">
            Updated: {formatDate(item.update_at, true)}
          </Text>
        </Group>
      </div>

      <Divider mt="xs" />
      <div
        className="flex justify-center py-2 bg-blue-400 cursor-pointer"
        onClick={handlePolicyView}
      >
        <IconArrowRight color="white" />
      </div>
      <AppModal opened={opened} onClose={close}>
        <CertificateDetail item={item} />
      </AppModal>
    </Card>
  );
}
