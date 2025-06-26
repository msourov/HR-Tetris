import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconClipboardList,
  IconClock,
  IconMapPin,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { Meeting } from "../../../../features/types/meeting";
import { colorMap } from "../../../../components/ui/TaskPriorityItems";
import { useEffect, useState } from "react";

type MeetingDetailProps = {
  selectedMeeting: Meeting;
  close?: () => void;
};

const MeetingDetail = ({
  selectedMeeting,
  close = () => {},
}: MeetingDetailProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMeeting?.meeting_at) return;

    const updateTime = () => {
      const result = getTimeUntilMeeting(selectedMeeting.meeting_at);
      setTimeRemaining(result);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [selectedMeeting?.meeting_at]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilMeeting = (dateString: string) => {
    const now = new Date();
    const meetingDate = new Date(dateString);
    const diff = meetingDate.getTime() - now.getTime();

    if (diff < 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) return `${Math.floor(hours / 24)} days`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <>
      <div className="overflow-y-auto space-y-2">
        <Title
          order={5}
          fw={700}
          className="flex items-center text-blue-700 gap-2"
        >
          <IconCalendarEvent size={20} />
          Meeting Details
        </Title>
        <Paper p="sm" radius="md" bg="gray.0">
          <Group justify="space-between" mb={6}>
            <Text size="lg">{selectedMeeting?.name}</Text>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    selectedMeeting?.priority in colorMap
                      ? colorMap[
                          selectedMeeting?.priority as keyof typeof colorMap
                        ].color
                      : "gray",
                }}
              />
              <Text size="sm">{selectedMeeting?.priority}</Text>
            </Box>
          </Group>
          <div className="border rounded-lg px-2 bg-slate-100 h-[3rem] max-h-[100px] overflow-y-auto">
            {selectedMeeting?.descriptions}
          </div>
        </Paper>

        <Divider />

        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
            <IconClock size={18} />
          </ThemeIcon>
          <div className="w-full">
            <Text c="gray" className="text-sm">
              Date & Time
            </Text>
            <div className="flex justify-between">
              <Text className="text-sm">
                {formatDate(selectedMeeting?.meeting_at)}
              </Text>
              {timeRemaining && (
                <Badge variant="light" color="blue">
                  Starting in {timeRemaining}
                </Badge>
              )}
            </div>
          </div>
        </Group>

        <Group wrap="nowrap" align="flex-start">
          {selectedMeeting?.meeting_type === "online" ? (
            <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
              <IconVideo size={18} />
            </ThemeIcon>
          ) : (
            <ThemeIcon variant="light" color="teal" size="lg" radius="xl">
              <IconMapPin size={18} />
            </ThemeIcon>
          )}
          <div>
            <Text c="gray" className="text-sm">
              Meeting Type
            </Text>
            <Text className="text-sm">
              {selectedMeeting?.meeting_type === "online"
                ? "Online Meeting"
                : "In-person"}
            </Text>
            {selectedMeeting?.meeting_type === "online" ? (
              <Anchor
                href={selectedMeeting?.online_link}
                target="_blank"
                mt="xs"
              >
                {selectedMeeting?.online_link}
              </Anchor>
            ) : (
              <Text mt="xs">
                {selectedMeeting.location || "Location not specified"}
              </Text>
            )}
          </div>
        </Group>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
            <IconUsers size={18} />
          </ThemeIcon>
          <div>
            <Text c="gray" className="text-sm">
              Participants{" "}
              <span className="text-blue-400">
                ({selectedMeeting?.meeting_person.length})
              </span>
            </Text>
            <Stack gap="xs" mt="xs">
              {selectedMeeting?.meeting_person.map((person) => (
                <Group key={person?.employee_id} wrap="nowrap">
                  <Avatar size="md" radius="xl">
                    {person?.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Text size="sm">{person?.name}</Text>
                    <Text size="xs" c="dimmed">
                      {person?.designation} • {person?.department}
                    </Text>
                  </div>
                </Group>
              ))}
            </Stack>
          </div>
        </Group>

        {selectedMeeting?.agenda && (
          <>
            <Divider />
            <Group wrap="nowrap" align="flex-start">
              <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
                <IconClipboardList size={20} />
              </ThemeIcon>
              <div className="w-full">
                <Text fw={500} size="md">
                  Agenda
                </Text>
                <div className="border rounded-lg px-2 bg-slate-100 h-[3rem] max-h-[100px] overflow-y-auto">
                  {selectedMeeting?.agenda}
                </div>
              </div>
            </Group>
          </>
        )}
      </div>
      <Group justify="flex-end" mt="lg">
        <Button variant="outline" color="gray" onClick={close}>
          Close
        </Button>
        {selectedMeeting?.meeting_type === "online" &&
          selectedMeeting?.online_link && (
            <Anchor
              href={selectedMeeting.online_link}
              target="_blank"
              rel="noopener noreferrer"
              underline="never"
            >
              <Button
                color="blue"
                leftSection={<IconVideo size={18} />}
                radius="md"
              >
                Join Meeting
              </Button>
            </Anchor>
          )}
      </Group>
    </>
  );
};

export default MeetingDetail;
