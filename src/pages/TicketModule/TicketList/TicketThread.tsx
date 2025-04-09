import {
  Stack,
  Group,
  Button,
  Text,
  Divider,
  Card,
  Avatar,
  Paper,
  FileInput,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconX, IconPaperclip } from "@tabler/icons-react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Ticket } from "../../../features/types/ticket";
import {
  useGetAllTicketsQuery,
  useResolveTicketMutation,
} from "../../../features/api/ticketSlice";
import useFormatDate from "../../../services/utils/useFormatDate";
import axios from "axios";
import { getToken } from "../../../services/utils/getToken";

interface TicketThreadProps {
  ticket: Ticket;
  onBack: () => void;
}

const TicketThread = ({ ticket, onBack }: TicketThreadProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState("Dummy message");
  const [files, setFiles] = useState<File[]>([]);
  const [resolveTicket] = useResolveTicketMutation();
  const { refetch } = useGetAllTicketsQuery({ page: 1, limit: 10 });
  const { formatDate } = useFormatDate();

  const token = getToken();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("message", newMessage);
      files.forEach((file) => formData.append("file", file));

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}tickets/chat/${ticket.uid}`,
        formData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      notifications.show({
        title: "Success!",
        message: response.data.message,
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setNewMessage("");
      setFiles([]);
      await refetch();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to send message"
        : "Failed to send message";

      notifications.show({
        title: "Error",
        message: message,
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setIsSubmitting(false);
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
        {ticket.name}
      </Text>
      <Text c="dimmed">Created {formatDate(ticket.create_at)}</Text>

      <Divider my="md" />

      <Stack gap="xl">
        {ticket.chat.map((message, index) => (
          <Card key={index} withBorder>
            <Group align="start" mb="sm">
              <Avatar src={message?.user_name} size="md" />
              <div>
                <Text fw={500}>{message.user_name}</Text>
                <Text size="sm" c="dimmed">
                  {formatDate(message.create_at)}
                </Text>
              </div>
            </Group>

            <Text className="mb-2">{message.message}</Text>

            {/* {message.uploads?.length > 0 && (
              <Group gap="sm">
                {message.uploads.map((file, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="xs"
                    leftSection={<IconPaperclip size={14} />}
                    component="a"
                    href={`${import.meta.env.VITE_APP_BASE_URL}tickets/file/${file.file_name
                      }`}
                    target="_blank"
                  >
                    {file.file_name}
                  </Button>
                ))}
              </Group>
            )} */}
            {message.uploads?.length > 0 && (
              <Group gap="sm">
                {message.uploads.map((file, i) => {
                  const fileUrl = `https://api.hr-infozilion.pitetris.com/${file.file_path}`;
                  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(
                    file.file_extension.toLowerCase()
                  );
                  const isVideo = ['mp4', 'webm', 'mov'].includes(
                    file.file_extension.toLowerCase()
                  );

                  return (
                    <div key={i}>
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={file.file_name}
                          style={{ maxWidth: 200, maxHeight: 200 }}
                          className="rounded-md"
                        />
                      ) : isVideo ? (
                        <video
                          controls
                          style={{ maxWidth: 200, maxHeight: 200 }}
                          className="rounded-md"
                        >
                          <source src={fileUrl} type={file.file_type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Button
                          variant="outline"
                          size="xs"
                          leftSection={<IconPaperclip size={14} />}
                          component="a"
                          href={fileUrl}
                          target="_blank"
                        >
                          {file.file_name}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </Group>
            )}
          </Card>
        ))}
      </Stack>

      {ticket.status === "open" && (
        <Paper withBorder className="p-4 mt-4">
          <Textarea
            placeholder="Add a comment..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            autosize
            minRows={3}
            className="mb-3"
          />

          <Group justify="space-between">
            <FileInput
              accept="image/*, .pdf, .doc, .docx"
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
              loading={isSubmitting}
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
