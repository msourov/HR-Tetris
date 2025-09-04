// AnnouncementDetails.tsx
import {
  Avatar,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Text,
  Textarea,
} from "@mantine/core";
import { Announcement } from "../../../features/types/announcement";
import AppApprovalStatus from "../../../components/core/AppApprovalStatus";
import { IconClipboardText, IconTrash, IconUser } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useDeleteAnnouncementMutation } from "../../../features/api/announcementSlice";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

interface AnnouncementDetailsProps {
  announcement: Announcement;
  value: string;
  setValue: (value: string) => void;
  closeModal: () => void;
  handleApproveAnnouncement: (uid: string) => void;
  handleRejectAnnouncement: (uid: string) => void;
}

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({
  announcement,
  value,
  setValue,
  closeModal,
  handleApproveAnnouncement,
  handleRejectAnnouncement,
}) => {
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD MMM YYYY, hh:mm A");
  };

  const handleDeleteAnnouncement = async (uid: string) => {
    try {
      const res = await deleteAnnouncement({ uid }).unwrap();
      notifications.show({
        title: "Deleted!",
        message: res?.message || "Announcement deleted successfully.",
        icon: <IconTrash size={18} />,
        color: "red",
      });
      closeDelete();
      closeModal()
    } catch (err) {
      console.error("Delete failed:", err);
      notifications.show({
        title: "Error",
        message: "Failed to delete announcement.",
        icon: <IconTrash size={18} />,
        color: "red",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card
        withBorder
        shadow="sm"
        radius="md"
        className="border border-gray-200"
      >
        <Group justify="space-between" align="flex-start" mb="md">
          <div>
            <Text size="xl" fw={700} className="text-gray-800">
              {announcement.name}
            </Text>
            <AppApprovalStatus status={announcement.is_approved} />
          </div>

          <div className="flex flex-col items-end">
            <Text size="sm" c="dimmed">
              Created: {formatDate(announcement.create_at)}
            </Text>
            <Text size="sm" c="dimmed">
              Updated: {formatDate(announcement.update_at)}
            </Text>
          </div>
        </Group>

        <Divider my="sm" />

        <Group mb="md">
          <IconClipboardText size={18} className="text-gray-500" />
          <Text size="md" fw={500} className="text-gray-700">
            Description
          </Text>
        </Group>

        <Text
          className="bg-gray-50 p-4 rounded-lg text-gray-700 min-h-[120px] max-h-[250px] overflow-y-auto scrollbar-custom"
          size="sm"
        >
          {announcement.descriptions}
        </Text>

        <Divider my="md" />
        <Text size="sm" c="dimmed" mb="sm">
          Created By
        </Text>
        <Group justify="space-between">
          <div className="flex flex-col gap-2">
            <Group>
              <Avatar color="blue" radius="xl" size="sm">
                <IconUser size={24} />
              </Avatar>
              <div>
                <Text size="sm" fw={500}>
                  {announcement.creator_name}
                </Text>

                <Text size="sm" c="dimmed">
                  {announcement.department_name}
                </Text>
              </div>
            </Group>
          </div>
        </Group>
      </Card>

      {announcement.is_approved === "pending" && (
        <Card withBorder radius="md" className="border-blue-100 bg-blue-50">
          <Text size="md" fw={500} mb="sm" className="text-gray-700">
            Review Action
          </Text>

          <Textarea
            label="Reason for rejection (optional)"
            description="Required if rejecting this announcement"
            placeholder="Provide specific feedback..."
            variant="filled"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            minRows={3}
            className="mb-4"
          />

          <Group justify="flex-end" mt="md">
            <Group>
              <Button
                variant="outline"
                color="red"
                onClick={() => handleRejectAnnouncement(announcement.uid)}
                disabled={!value}
                className="border-red-300"
              >
                Reject
              </Button>
              <Button
                variant="filled"
                color="teal"
                onClick={() => handleApproveAnnouncement(announcement.uid)}
              >
                Approve
              </Button>
            </Group>
          </Group>
        </Card>
      )}
      <Button
        variant="light"
        color="red"
        onClick={openDelete}
        leftSection={<IconTrash size={16} />}
        loading={isDeleting}
        className="w-full"
      >
        Delete
      </Button>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        withCloseButton={false}
        centered
      >
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            Are you sure you want to delete announcement:{" "}
            <span className="font-semibold">{announcement.name}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              color="red"
              onClick={() => handleDeleteAnnouncement(announcement.uid)}
              loading={isDeleting}
              className="px-6"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              color="gray"
              onClick={closeDelete}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* {announcement.is_approved !== "pending" && (
        <Card withBorder radius="md" className="border-gray-200">
          <Text size="lg" fw={500} mb="sm" className="text-center">
            Announcement Status
          </Text>
          <div className="flex justify-center">
            <AppApprovalStatus status={announcement.is_approved} />
          </div>
        </Card>
      )} */}
    </div>
  );
};

export default AnnouncementDetails;
