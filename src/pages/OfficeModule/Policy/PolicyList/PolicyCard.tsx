import { Badge, Button, Card, Group, Modal, Text } from "@mantine/core";
import { IconDownload, IconEye, IconFileText } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import PolicyReviewModal from "./PolicyReviewModal";
import { AllPolicy } from "../../../../features/types/policy";

interface PolicyCardProps {
  item: AllPolicy;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  getFileIcon: (fileName: string) => React.ReactNode; // New prop to determine if it's a file or text policy
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  item,
  onView,
  onDownload,
  getFileIcon,
}) => {
  const isFile = !item.descriptions;
  const date = dayjs(item.create_at).format("MMM D, YYYY");
  const [opened, { open, close }] = useDisclosure(false);

  // Strip HTML tags for preview
  const plainTextDescription = item.descriptions
    ? item.descriptions.replace(/<[^>]*>/g, "")
    : "";

  return (
    <>
      <Card
        withBorder
        shadow="sm"
        radius="md"
        className="h-full flex flex-col hover:shadow-md transition-shadow"
      >
        {/* Header section with icon and badge */}
        <Card.Section p="md" className="bg-gray-50 border-b">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              {isFile ? (
                getFileIcon(item.name)
              ) : (
                <IconFileText size={20} className="text-blue-600" />
              )}
              <Text fw={600} size="sm" className="max-w-[70%] truncate">
                {item.name}
              </Text>
            </Group>
            <Badge color={isFile ? "blue" : "green"} variant="light" size="sm">
              {isFile ? "File" : "Text"}
            </Badge>
          </Group>
        </Card.Section>

        {/* Content section */}
        <div className="flex flex-col flex-grow py-2">
          <Text
            size="sm"
            lineClamp={4}
            className="mb-4 text-gray-500 leading-relaxed"
          >
            {isFile
              ? "Click download to access this policy document"
              : plainTextDescription}
          </Text>

          <Text size="xs" className="text-gray-600 font-semibold mt-auto">
            {date}
          </Text>
        </div>

        {/* Action buttons section */}
        <Card.Section p="md" className="border-t">
          <Group gap="xs" justify="space-between">
            <div className="flex-1">
              {isFile ? (
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  fullWidth
                  leftSection={<IconDownload size={16} />}
                  onClick={() => onDownload(item.uid)}
                >
                  Download
                </Button>
              ) : (
                <Button
                  variant="light"
                  color="green"
                  size="sm"
                  fullWidth
                  leftSection={<IconEye size={16} />}
                  onClick={() => onView(item.uid)}
                >
                  View
                </Button>
              )}
            </div>

            {/* <img src="/assets/review_icon.png" className="w-4 h-4" /> */}
            {item?.is_approved === null ? (
              <button
                onClick={open}
                className="rounded-lg text-blue-500  hover:shadow-md hover:bg-blue-50 p-1 "
              >
                Review
              </button>
            ) : (
              <p
                className={`text-[11px] ${
                  item?.is_approved ? "text-green-400" : "text-red-500"
                }`}
              >
                {item?.is_approved.toUpperCase()}
              </p>
            )}

            {/* <Menu withinPortal shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconCheck size={14} color="green" />}
                  onClick={open}
                >
                  Approve
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconX size={14} color="red" />}
                  onClick={open}
                >
                  Reject
                </Menu.Item>
              </Menu.Dropdown>
            </Menu> */}
          </Group>
        </Card.Section>
      </Card>

      {/* Review modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={`Review Policy: ${item.name}`}
        size="lg"
      >
        <PolicyReviewModal uid={item.uid} close={close} />
      </Modal>
    </>
  );
};

export default PolicyCard;
