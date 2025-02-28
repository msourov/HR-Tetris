import {
  Stack,
  Group,
  Button,
  Text,
  Divider,
  Card,
  Avatar,
  Paper,
  TextInput,
  FileInput,
} from "@mantine/core";
import { IconCheck, IconX, IconPaperclip } from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import axios from "axios";

import { Ticket } from "../../../features/types/ticket";
import {
  useGetAllTicketsQuery,
  useResolveTicketMutation,
} from "../../../features/api/ticketSlice";
import useFormatDate from "../../../services/utils/useFormatDate";

interface TicketThreadProps {
  ticket: Ticket;
  onBack: () => void;
}

const TicketThread = ({ ticket, onBack }: TicketThreadProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [resolveTicket] = useResolveTicketMutation();
  const { refetch } = useGetAllTicketsQuery({ page: 1, limit: 10 });
  const { formatDate } = useFormatDate();

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("message", newMessage);
      files.forEach((file) => formData.append("attachments", file));

      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}tickets/chat/${ticket.uid}`,
        formData
      );
      setNewMessage("");
      setFiles([]);
      await refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to send message",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const handleResolve = async () => {
    try {
      await resolveTicket({ uid: ticket.uid });
      await refetch();
      notifications.show({
        title: "Resolved",
        message: "Ticket marked as resolved",
        color: "green",
        icon: <IconCheck />,
      });
      onBack();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to resolve ticket",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Button variant="subtle" onClick={onBack}>
          ← Back to Tickets
        </Button>
        {ticket.status === "open" && (
          <Button
            color="green"
            leftSection={<IconCheck size={18} />}
            onClick={handleResolve}
          >
            Mark Resolved
          </Button>
        )}
      </Group>

      <Text size="xl" fw="bold">
        {ticket.subject}
      </Text>
      <Text c="dimmed">Created {formatDate(ticket.created_at)}</Text>

      <Divider my="md" />

      <Stack gap="xl">
        {ticket.chat.map((message, index) => (
          <Card key={index} withBorder>
            <Group align="start" mb="sm">
              <Avatar src={message.avatar} size="md" />
              <div>
                <Text fw={500}>{message.user_name}</Text>
                <Text size="sm" c="dimmed">
                  {formatDate(message.created_at)}
                </Text>
              </div>
            </Group>

            <Text className="mb-2">{message.message}</Text>

            {message.uploads?.length > 0 && (
              <Group gap="sm">
                {message.uploads.map((file, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="xs"
                    leftSection={<IconPaperclip size={14} />}
                    component="a"
                    href={`${import.meta.env.VITE_APP_BASE_URL}tickets/file/${
                      file.id
                    }`}
                    target="_blank"
                  >
                    {file.file_name}
                  </Button>
                ))}
              </Group>
            )}
          </Card>
        ))}
      </Stack>

      {ticket.status === "open" && (
        <Paper withBorder className="p-4 mt-4">
          <TextInput
            placeholder="Add a comment..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            multiline
            autosize
            minRows={3}
            className="mb-3"
          />

          <Group justify="space-between">
            <FileInput
              multiple
              value={files}
              onChange={setFiles}
              leftSection={<IconPaperclip size={18} />}
              placeholder="Attach files"
              clearable
            />

            <Button
              onClick={handleSubmit}
              disabled={!newMessage && files.length === 0}
            >
              Post Comment
            </Button>
          </Group>
        </Paper>
      )}
    </Stack>
  );
};

export default TicketThread;
