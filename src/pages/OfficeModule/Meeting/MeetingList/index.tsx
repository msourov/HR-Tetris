import { useState } from "react";
import {
  Badge,
  Card,
  Group,
  Text,
  Button,
  Modal,
  Stack,
  Divider,
  Avatar,
  Anchor,
  Title,
  ThemeIcon,
  Paper,
  ActionIcon,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconChevronRight,
  IconClock,
  IconMapPin,
  IconStarFilled,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { IconClipboardList } from "@tabler/icons-react";
import { useGetMeetingsQuery } from "../../../../features/api/meetingSlice";
import { colorMap } from "../../../../components/ui/TaskPriorityItems";

interface MeetingPerson {
  employee_id: string;
  name: string;
  department: string;
  designation: string;
}

interface MeetingData {
  id: number;
  name: string;
  descriptions: string;
  meeting_type: string;
  online_link: string;
  priority: string;
  location: string | null;
  duration: string | null;
  agenda: string | null;
  meeting_at: string;
  meeting_person: MeetingPerson[];
}

const priorityColors: Record<string, string> = {
  high: "red",
  medium: "yellow",
  low: "green",
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

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <IconStarFilled size={14} />;
    case "medium":
      return <IconStarFilled size={12} />;
    default:
      return <IconStarFilled size={10} />;
  }
};

export default function MeetingList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetMeetingsQuery({
    page,
    limit,
  });

  const meetings = data?.data;

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingData | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);

  const handleCardClick = (meeting: MeetingData) => {
    setSelectedMeeting(meeting);
    open();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <Group justify="start" mb="md" className="w-fit">
        <Text className="text-gray-600 rounded-md p-2 text-xl">Meetings</Text>
        <Badge variant="light" color="blue" size="md">
          {meetings?.length || 0} meetings scheduled
        </Badge>
      </Group>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings?.map((meeting) => (
          <div
            key={meeting.id}
            className="p-lg rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transition-colors"
          >
            <Card withBorder p="md" bg="gray.0">
              <Group justify="space-between">
                <Group gap={4}>
                  <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
                    <IconCalendarEvent size={14} />
                  </ThemeIcon>
                  <Text fw={600} size="sm" c="dimmed">
                    {formatDate(meeting.meeting_at).split(",")[0]}
                  </Text>
                </Group>
                <Badge
                  color={priorityColors[meeting.priority]}
                  variant="light"
                  leftSection={getPriorityIcon(meeting.priority)}
                >
                  {meeting.priority}
                </Badge>
              </Group>
            </Card>

            <div className="px-4 flex flex-col gap-2">
              <Text fw={700} className="text-lg mt-4" lineClamp={1}>
                {meeting.name}
              </Text>

              <Text size="sm" c="dimmed" lineClamp={2}>
                {meeting.descriptions}
              </Text>

              <Group gap="xs" wrap="nowrap">
                <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
                  <IconClock size={14} />
                </ThemeIcon>
                <Text size="sm" fw={500} c="dark">
                  {formatDate(meeting.meeting_at)}
                </Text>
                <Text size="sm" c="dimmed">
                  • {getTimeUntilMeeting(meeting.meeting_at)}
                </Text>
              </Group>

              <Group gap="xs" wrap="nowrap">
                {meeting.meeting_type === "online" ? (
                  <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
                    <IconVideo size={14} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon variant="light" color="teal" size="sm" radius="xl">
                    <IconMapPin size={14} />
                  </ThemeIcon>
                )}
                <Text size="sm" c="dark">
                  {meeting.meeting_type === "online"
                    ? "Online Meeting"
                    : "In-person"}
                </Text>
              </Group>

              <Group gap="xs" wrap="nowrap" mt="xs">
                <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
                  <IconUsers size={14} />
                </ThemeIcon>
                <Group gap={4}>
                  {meeting.meeting_person.slice(0, 3).map((person) => (
                    <Avatar key={person.employee_id} size={24} radius="xl">
                      {person.name.charAt(0)}
                    </Avatar>
                  ))}
                  {meeting.meeting_person.length > 3 && (
                    <Avatar size={24} radius="xl">
                      +{meeting.meeting_person.length - 3}
                    </Avatar>
                  )}
                </Group>
              </Group>
            </div>

            <Card
              mt="sm"
              p="md"
              withBorder
              bg="gray.0"
              className="cursor-pointer"
              onClick={() => handleCardClick(meeting)}
            >
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  View details
                </Text>
                <ActionIcon variant="subtle" color="gray">
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Group>
            </Card>
          </div>
        ))}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Title order={3} fw={700} className="flex items-center gap-2">
            <IconCalendarEvent size={20} />
            Meeting Details
          </Title>
        }
        size="lg"
        transitionProps={{ duration: 300 }}
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.25,
          blur: 3,
        }}
      >
        {selectedMeeting && (
          <Stack gap="lg">
            <Paper p="md" withBorder radius="md" bg="gray.0">
              <Group justify="space-between">
                <Text fw={700} size="xl">
                  {selectedMeeting.name}
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
                        selectedMeeting.priority in colorMap
                          ? colorMap[
                              selectedMeeting.priority as keyof typeof colorMap
                            ].color
                          : "gray",
                    }}
                  />
                  <Text>{selectedMeeting.priority}</Text>
                </Box>
                {/* <Badge
                  color={priorityColors[selectedMeeting.priority]}
                  variant="light"
                  size="lg"
                  leftSection={getPriorityIcon(selectedMeeting.priority)}
                >
                  {selectedMeeting.priority} priority
                </Badge> */}
              </Group>
              <Text mt="xs" c="dimmed">
                {selectedMeeting.descriptions}
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
                <Text>{formatDate(selectedMeeting.meeting_at)}</Text>
                {getTimeUntilMeeting(selectedMeeting.meeting_at) && (
                  <Badge variant="light" color="blue" mt="xs">
                    Starting in{" "}
                    {getTimeUntilMeeting(selectedMeeting.meeting_at)}
                  </Badge>
                )}
              </div>
            </Group>

            <Group wrap="nowrap" align="flex-start">
              {selectedMeeting.meeting_type === "online" ? (
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
                  {selectedMeeting.meeting_type === "online"
                    ? "Online Meeting"
                    : "In-person"}
                </Text>
                {selectedMeeting.meeting_type === "online" ? (
                  <Anchor
                    href={selectedMeeting.online_link}
                    target="_blank"
                    mt="xs"
                  >
                    {selectedMeeting.online_link}
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
                    ({selectedMeeting.meeting_person.length})
                  </span>
                </Text>
                <Stack gap="xs" mt="xs">
                  {selectedMeeting.meeting_person.map((person) => (
                    <Group key={person.employee_id} wrap="nowrap">
                      <Avatar size="md" radius="xl">
                        {person.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={500}>{person.name}</Text>
                        <Text size="sm" c="dimmed">
                          {person.designation} • {person.department}
                        </Text>
                      </div>
                    </Group>
                  ))}
                </Stack>
              </div>
            </Group>

            {selectedMeeting.agenda && (
              <>
                <Divider />
                <Group wrap="nowrap" align="flex-start">
                  <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
                    <IconClipboardList size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Agenda</Text>
                    <Paper p="md" mt="xs" withBorder radius="md">
                      <Text>{selectedMeeting.agenda}</Text>
                    </Paper>
                  </div>
                </Group>
              </>
            )}

            <Group justify="flex-end" mt="lg">
              <Button variant="outline" color="gray" onClick={close}>
                Close
              </Button>
              <Button
                color="blue"
                leftSection={<IconVideo size={18} />}
                radius="md"
              >
                Join Meeting
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
