import { Card, Container, Stack, Text, Timeline, Title } from "@mantine/core";
import CertificateCard from "./CCCard";
import { CompanyCredential } from "../../../features/types/companyCredentials";
import useFormatDate from "../../../services/utils/useFormatDate";

export function CertificateDetail({ item }: { item: CompanyCredential }) {
  const { formatDate } = useFormatDate();
  return (
    <Container size="lg" py="xl">
      <CertificateCard item={item} />

      <Card withBorder radius="md" mt="xl" padding="lg">
        <Title order={4} mb="md">
          Audit Logs
        </Title>

        <Timeline active={item.logs.length - 1}>
          {item.logs.map((log, index) => (
            <Timeline.Item key={index}>
              <Text c="dimmed" fz="sm">
                {formatDate(log.create_at, true)}
              </Text>
              <Stack gap={0}>
                <Text fw={500}>{log.message}</Text>
                <Text c="dimmed" fz="sm">
                  By: {log.admin}
                </Text>
              </Stack>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </Container>
  );
}
