import {
  Stack,
  Group,
  Button,
  Text,
  Divider,
  Card,
  Paper,
  FileInput,
  Textarea,
} from "@mantine/core";
import { IconCheck, IconX, IconPaperclip } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Ticket } from "../../../features/types/ticket";
import { useResolveTicketMutation } from "../../../features/api/ticketSlice";
import useFormatDate from "../../../services/utils/useFormatDate";
import axios from "axios";
import { getToken } from "../../../services/utils/getToken";
import { getImageUrl } from "../../../services/utils/getImageUrl";
import UserImage from "../../../components/core/UserImage";

interface TicketThreadProps {
  ticket: Ticket;
  refetchTickets: () => Promise<unknown>;
  onBack: () => void;
}

const TicketThread = ({
  ticket,
  refetchTickets,
  onBack,
}: TicketThreadProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState("Dummy message");
  const [files, setFiles] = useState<File[]>([]);
  const [resolveTicket] = useResolveTicketMutation();
  // const { refetch } = useGetAllTicketsQuery({ page: 1, limit: 10 });
  const { formatDate } = useFormatDate();

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.chat]);

  const getMimeType = (ext: string) => {
    const map: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
    };
    return map[ext.toLowerCase()] || "video/*";
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [ticket.chat]);

  useEffect(() => {
    console.log(files);
  }, [files]);

  const token = getToken();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("message", newMessage);
      files.forEach((file) => formData.append("files", file));

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
      await refetchTickets();
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
      await refetchTickets();
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
        <Button variant="subtle" color="blue" onClick={onBack}>
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
      <div className="px-4">
        <Text size="lg" fw="bold" className="text-blue-500">
          {ticket.name}
        </Text>
        <Text c="dimmed">Created {formatDate(ticket.create_at)}</Text>

        <Divider my="md" />
        <div
          ref={containerRef}
          className="overflow-y-auto max-h-[480px] scrollbar-custom"
        >
          <Stack gap="xl">
            {ticket.chat.map((message, index) => (
              <>
                <Card key={index} withBorder className="flex-shrink-0">
                  <Group align="start" mb="sm">
                    {/* <Avatar src={message?.user_name} size="md" /> */}
                    <UserImage
                      src={getImageUrl(message?.user_id)}
                      size={30}
                      className="border"
                    />
                    <div>
                      <Text fw={500}>{message.user_name}</Text>
                      <Text size="sm" c="dimmed">
                        {formatDate(message.create_at, true)}
                      </Text>
                    </div>
                  </Group>

                  <Text className="mb-2">{message.message}</Text>
                  {message.uploads?.length > 0 && (
                    <Group gap="sm">
                      {message.uploads.map((file) => {
                        // const fileUrl = `https://api.hr-infozilion.pitetris.com/${file.file_path}`;
                        // const isImage = ["jpg", "jpeg", "png", "gif"].includes(
                        //   file.file_extension.toLowerCase()
                        // );
                        // const isVideo = ["mp4", "webm", "mov"].includes(
                        //   file.file_extension.toLowerCase()
                        // );
                        const fileUrl = `https://api.hr-infozilion.pitetris.com/${file.file_path}`;
                        const isImage = ["jpg", "jpeg", "png", "gif"].includes(
                          file.file_extension.toLowerCase()
                        );
                        const isVideo = ["mp4", "webm", "mov"].includes(
                          file.file_extension.toLowerCase()
                        );

                        return (
                          <div key={file.file_name}>
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt={file.file_name}
                                style={{ maxWidth: 200, maxHeight: 200 }}
                                className="rounded-md"
                              />
                            ) : isVideo ? (
                              <div className="flex items-center gap-2">
                                <video
                                  controls
                                  style={{ maxWidth: 200, maxHeight: 200 }}
                                  className="rounded-md"
                                >
                                  <source
                                    src={fileUrl}
                                    type={getMimeType(file.file_extension)}
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                {/* <div className="flex items-center cursor-pointer">
                                  <IconDownload size={18} color="gray" />
                                </div> */}
                              </div>
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
                {/* <div ref={endRef} /> */}
              </>
            ))}
          </Stack>
          <div ref={bottomRef} />
        </div>

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
                color="blue"
                onClick={handleSubmit}
                disabled={!newMessage && files.length === 0}
                loading={isSubmitting}
              >
                Post Comment
              </Button>
            </Group>
          </Paper>
        )}
      </div>
    </Stack>
  );
};

export default TicketThread;
