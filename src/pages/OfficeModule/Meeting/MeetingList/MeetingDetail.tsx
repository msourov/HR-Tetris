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
} from "@mantine/core";
import {
  IconClipboardList,
  IconClock,
  IconMapPin,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { Meeting } from "../../../../features/types/meeting";
import { colorMap } from "../../../../components/ui/TaskPriorityItems";

type MeetingDetailProps = {
  selectedMeeting: Meeting;
  close?: () => void;
};

const MeetingDetail = ({
  selectedMeeting,
  close = () => {},
}: MeetingDetailProps) => {
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
    <Stack gap="lg">
      <Paper p="md" withBorder radius="md" bg="gray.0">
        <Group justify="space-between">
          <Text fw={600} size="xl">
            {selectedMeeting?.name}
          </Text>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor:
                  selectedMeeting?.priority in colorMap
                    ? colorMap[
                        selectedMeeting?.priority as keyof typeof colorMap
                      ].color
                    : "gray",
              }}
            />
            <Text>{selectedMeeting?.priority}</Text>
          </Box>
        </Group>
        <Text mt="xs" c="dimmed">
          {selectedMeeting?.descriptions}
        </Text>
      </Paper>

      <Divider />

      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
          <IconClock size={20} />
        </ThemeIcon>
        <div>
          <Text fw={600} c="gray">
            Date & Time
          </Text>
          <Text>{formatDate(selectedMeeting?.meeting_at)}</Text>
          {getTimeUntilMeeting(selectedMeeting?.meeting_at) && (
            <Badge variant="light" color="blue" mt="xs">
              Starting in {getTimeUntilMeeting(selectedMeeting?.meeting_at)}
            </Badge>
          )}
        </div>
      </Group>

      <Group wrap="nowrap" align="flex-start">
        {selectedMeeting?.meeting_type === "online" ? (
          <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
            <IconVideo size={20} />
          </ThemeIcon>
        ) : (
          <ThemeIcon variant="light" color="teal" size="lg" radius="xl">
            <IconMapPin size={20} />
          </ThemeIcon>
        )}
        <div>
          <Text fw={600} c="gray">
            Meeting Type
          </Text>
          <Text>
            {selectedMeeting?.meeting_type === "online"
              ? "Online Meeting"
              : "In-person"}
          </Text>
          {selectedMeeting?.meeting_type === "online" ? (
            <Anchor href={selectedMeeting?.online_link} target="_blank" mt="xs">
              {selectedMeeting?.online_link}
            </Anchor>
          ) : (
            <Text mt="xs">
              {selectedMeeting.location || "Location not specified"}
            </Text>
          )}
        </div>
      </Group>

      <Divider />

      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
          <IconUsers size={20} />
        </ThemeIcon>
        <div>
          <Text fw={600} c="gray">
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
                  <Text fw={500}>{person?.name}</Text>
                  <Text size="sm" c="dimmed">
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
            <div>
              <Text fw={600}>Agenda</Text>
              <Paper p="md" mt="xs" withBorder radius="md">
                <Text>{selectedMeeting?.agenda}</Text>
              </Paper>
            </div>
          </Group>
        </>
      )}

      <Group justify="flex-end" mt="lg">
        <Button variant="outline" color="gray" onClick={close}>
          Close
        </Button>
        <Button color="blue" leftSection={<IconVideo size={18} />} radius="md">
          Join Meeting
        </Button>
      </Group>
    </Stack>
  );
};

export default MeetingDetail;
