import { useState } from "react";
import {
  Badge,
  Card,
  Group,
  Text,
  Avatar,
  Title,
  ThemeIcon,
  ActionIcon,
  Button,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconEdit,
  IconMapPin,
  IconStarFilled,
  IconTrash,
  IconUsers,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import {
  useDeleteMeetingMutation,
  useGetMeetingsQuery,
} from "../../../../features/api/meetingSlice";
import AppModal from "../../../../components/ui/AppModal";
import MeetingDetail from "./MeetingDetail";
import { Meeting } from "../../../../features/types/meeting";
import EditMeeting from "../EditMeeting";
import { notifications } from "@mantine/notifications";
import { ErrorResponse } from "react-router-dom";
import AppLoader from "../../../../components/ui/AppLoader";

const priorityColors: Record<string, string> = {
  high: "red",
  medium: "yellow",
  low: "green",
};

// const getTimeUntilMeeting = (dateString: string) => {
//   const now = new Date();
//   const meetingDate = new Date(dateString);
//   const diff = meetingDate.getTime() - now.getTime();

//   if (diff < 0) return null;

//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//   if (hours > 24) return `${Math.floor(hours / 24)} days`;
//   if (hours > 0) return `${hours}h ${minutes}m`;
//   return `${minutes}m`;
// };

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
  const [page] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetMeetingsQuery({
    page,
    limit,
  });

  const [deleteMeeting, { isLoading: deleteLoading }] =
    useDeleteMeetingMutation();

  const meetings = data?.data;

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] =
    useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const handleCardClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    open();
  };

  const handleEdit = (meeting: Meeting) => {
    editOpen();
    setSelectedMeeting(meeting);
  };

  const handleDelete = async () => {
    try {
      if (!selectedMeeting?.uid) return;
      const response = await deleteMeeting({
        uid: selectedMeeting.uid,
      }).unwrap();
      console.log(response);
      notifications.show({
        title: "Deleted",
        message: response.message || "Consumable deleted successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message:
          (error as ErrorResponse).data.detail || "Couldn't delete consumable",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      closeDelete();
    }
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

  if (isLoading) {
    <AppLoader />;
  }

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
            className="p-lg min-w-[320px] rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white transition-colors"
          >
            <Card withBorder p="sm" bg="gray.0">
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
                  size="sm"
                >
                  {meeting.priority}
                </Badge>
              </Group>
            </Card>

            <div className="px-4 flex flex-col gap-2">
              <Text fw={500} className="text-lg mt-2" lineClamp={1}>
                {meeting.name}
              </Text>

              <Text
                size="sm"
                lineClamp={2}
                className="bg-gray-400 text-white px-2 py-1 rounded-md"
              >
                {meeting.descriptions}
              </Text>

              <Group gap="xs" wrap="nowrap">
                <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
                  <IconClock size={12} />
                </ThemeIcon>
                <Text size="xs" fw={500} c="dark">
                  {formatDate(meeting.meeting_at)}
                </Text>
                {/* <Text size="sm" c="dimmed">
                  • {getTimeUntilMeeting(meeting.meeting_at)}
                </Text> */}
              </Group>

              <Group gap="xs" wrap="nowrap">
                {meeting.meeting_type === "online" ? (
                  <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
                    <IconVideo size={12} />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon variant="light" color="teal" size="sm" radius="xl">
                    <IconMapPin size={12} />
                  </ThemeIcon>
                )}
                <Text size="xs" c="dark">
                  {meeting.meeting_type === "online"
                    ? "Online Meeting"
                    : "In-person"}
                </Text>
              </Group>

              <Group gap="xs" wrap="nowrap">
                <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
                  <IconUsers size={12} />
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

            <Card mt="sm" p="md" withBorder bg="gray.0">
              <Group justify="space-between" align="center">
                <Button
                  variant="light"
                  color="blue"
                  onClick={() => handleCardClick(meeting)}
                >
                  View
                </Button>
                <Group gap={4}>
                  <ActionIcon
                    color="blue"
                    variant="light"
                    onClick={() => handleEdit(meeting)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => {
                      setSelectedMeeting(meeting);
                      openDelete();
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          </div>
        ))}
      </div>
      {/* View Modal */}
      <AppModal
        opened={opened}
        onClose={close}
        size="lg"
        transitionProps={{ duration: 300 }}
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.25,
          blur: 3,
        }}
      >
        {selectedMeeting && (
          <MeetingDetail selectedMeeting={selectedMeeting} close={close} />
        )}
      </AppModal>
      {/* Edit Modal */}
      <AppModal
        opened={editOpened}
        onClose={close}
        size="lg"
        title={
          <Title order={4} fw={700} className="flex items-center gap-2">
            <IconCalendarEvent size={20} />
            Edit Meeting
          </Title>
        }
        transitionProps={{ duration: 300 }}
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.25,
          blur: 3,
        }}
      >
        {selectedMeeting && (
          <EditMeeting
            selectedMeeting={selectedMeeting.uid}
            close={editClose}
          />
        )}
      </AppModal>
      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDelete}
        centered
        withCloseButton={false}
      >
        <p className="text-lg font-thin text-gray-500 mb-4 text-center">
          Are you sure you want to delete this consumable?
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Confirm
          </Button>
          <Button color="gray" onClick={closeDelete} disabled={deleteLoading}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
