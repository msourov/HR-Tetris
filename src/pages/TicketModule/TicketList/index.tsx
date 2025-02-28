import {
  Card,
  Text,
  Group,
  Stack,
  Divider,
  Button,
  List,
  Badge,
  Loader,
  Paper,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessage } from "@tabler/icons-react";
import { useState } from "react";
import { Ticket } from "../../../features/types/ticket";
import { useGetAllTicketsQuery } from "../../../features/api/ticketSlice";
import useFormatDate from "../../../services/utils/useFormatDate";
import TicketThread from "./TicketThread";

export default function TicketList() {
  const { data, isLoading } = useGetAllTicketsQuery({ page: 1, limit: 10 });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewArchived, { open: openArchive, close: closeArchive }] =
    useDisclosure(false);
  const { formatDate } = useFormatDate();
  const tickets = data?.data || [];

  const openTickets = tickets.filter((t) => t.status === "open");
  const archivedTickets = tickets.filter((t) => t.status === "resolved");
  if (isLoading) return <Loader className="mx-auto" />;

  return (
    <Group align="start" className="p-4 gap-4" wrap="nowrap">
      {/* Ticket Thread List */}
      <Stack className="w-80" gap="sm">
        <Text size="xl" fw="bold">
          Open Tickets
        </Text>
        <List spacing="sm">
          {openTickets.map((ticket) => (
            <List.Item key={ticket.id}>
              <Card
                withBorder
                onClick={() => setSelectedTicket(ticket)}
                className={`cursor-pointer ${
                  selectedTicket?.id === ticket.id ? "border-blue-500" : ""
                }`}
              >
                <Group justify="space-between">
                  <Text fw={500}>{ticket.subject}</Text>
                  <Badge color={ticket.status === "open" ? "blue" : "gray"}>
                    {ticket.status}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {ticket.chat[0]?.message}
                </Text>
                <Group justify="space-between" mt="sm">
                  <Text size="xs">{formatDate(ticket.created_at)}</Text>
                  <Group gap={4}>
                    <IconMessage size={14} />
                    <Text size="xs">{ticket.chat.length}</Text>
                  </Group>
                </Group>
              </Card>
            </List.Item>
          ))}
        </List>

        <Divider my="sm" />

        <Button variant="subtle" onClick={openArchive}>
          View Archived ({archivedTickets.length})
        </Button>
      </Stack>

      {/* Selected Ticket Thread */}
      <Paper withBorder className="flex-1 p-4">
        {selectedTicket ? (
          <TicketThread
            ticket={selectedTicket}
            onBack={() => setSelectedTicket(null)}
          />
        ) : (
          <Text c="dimmed" className="text-center">
            Select a ticket to view
          </Text>
        )}
      </Paper>

      {/* Archived Tickets Modal */}
      <Modal
        opened={viewArchived}
        onClose={closeArchive}
        title="Archived Tickets"
      >
        <Stack gap="sm">
          {archivedTickets.map((ticket) => (
            <Card key={ticket.id} withBorder>
              <Text fw={500}>{ticket.subject}</Text>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {ticket.chat[0]?.message}
              </Text>
              <Group justify="space-between" mt="sm">
                <Text size="xs">{formatDate(ticket.created_at)}</Text>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    closeArchive();
                  }}
                >
                  View Thread
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      </Modal>
    </Group>
  );
}
