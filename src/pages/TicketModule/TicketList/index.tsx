import {
  Card,
  Text,
  Group,
  Stack,
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
import { useGetAllTicketsQuery } from "../../../features/api/ticketSlice";
import useFormatDate from "../../../services/utils/useFormatDate";
import TicketThread from "./TicketThread";

export default function TicketList() {
  const { data, isLoading, error } = useGetAllTicketsQuery({
    page: 1,
    limit: 10,
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [viewArchived, { open: openArchive, close: closeArchive }] =
    useDisclosure(false);
  const { formatDate } = useFormatDate();
  const tickets = data?.data || [];

  const openTickets = tickets.filter((t) => t.status === "open");
  const archivedTickets = tickets.filter((t) => t.status === "resolved");
  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loader className="mx-auto" />
      </div>
    );

  console.error(error);

  return (
    <Group align="start" className="gap-4 h-full">
      {/* Ticket Thread List */}
      <Stack className="w-80 flex items-center p-4 " gap="sm" bg="blue">
        <Text size="lg" fw="bold" className=" text-white text-center">
          Open Tickets
        </Text>
        <List spacing="sm">
          {openTickets.map((ticket) => (
            <List.Item key={ticket.id} className="w-auto">
              <Card
                // withBorder
                onClick={() => setSelectedTicketId(ticket?.uid)}
                className={`cursor-pointer w-[300px] ${
                  selectedTicketId === ticket.uid ? "border-blue-500" : ""
                }`}
              >
                <Group justify="space-between" className="w-full">
                  <Text fw={500} className="truncate text-blue-500">
                    {ticket.name}
                  </Text>
                  <Badge color={ticket.status === "open" ? "blue" : "gray"}>
                    {ticket.status}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" className="truncate">
                  {ticket.chat[0]?.message}
                </Text>
                <Group justify="space-between" mt="sm">
                  <Text size="xs">{formatDate(ticket.create_at)}</Text>
                  <Group gap={4}>
                    <IconMessage size={14} />
                    <Text size="xs">{ticket.chat.length}</Text>
                  </Group>
                </Group>
              </Card>
            </List.Item>
          ))}
        </List>

        <Button variant="transparent" c="white" onClick={openArchive} mt={10}>
          View Archived ({archivedTickets.length})
        </Button>
      </Stack>

      {/* Selected Ticket Thread */}
      <Paper className="flex-1 p-4">
        {selectedTicketId ? (
          <TicketThread
            ticketId={selectedTicketId}
            onBack={() => setSelectedTicketId(null)}
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
        title={<p className="font-semibold text-gray-500">Archived Tickets</p>}
      >
        <Stack gap="sm">
          {archivedTickets.map((ticket) => (
            <Card key={ticket.id} withBorder className="bg-gray-200">
              <Text fw={500}>{ticket.name}</Text>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {ticket.chat[0]?.message}
              </Text>
              <Group justify="space-between" mt="sm">
                <Text size="xs">{formatDate(ticket.create_at)}</Text>
                <Button
                  size="xs"
                  color="blue"
                  variant="outline"
                  onClick={() => {
                    setSelectedTicketId(ticket?.uid);
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
