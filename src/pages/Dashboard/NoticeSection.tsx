/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Accordion,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Text,
} from "@mantine/core";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Announcement } from "../../features/types/announcement";
import useFormatDate from "../../services/utils/useFormatDate";
import { IconCalendar, IconCheck, IconUser, IconX } from "@tabler/icons-react";
import AppApprovalStatus from "../../components/core/AppApprovalStatus";

type NoticeSectionProps = {
  data: Announcement | Announcement[];
  loading: boolean;
  error: FetchBaseQueryError;
};

const NoticeSection: FC<NoticeSectionProps> = ({ data, loading, error }) => {
  const { formatDate } = useFormatDate();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const handleModalOpen = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    open();
  };

  // Normalize data to array
  const announcements = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm">
      <Box className="bg-[#8d8d4f] text-white rounded-t-lg py-2">
        <Text fw={600} size="lg" ta="center">
          Announcement Requests
        </Text>
      </Box>
      <ScrollArea.Autosize mah={400} type="scroll">
        <Accordion transitionDuration={200} className="w-full py-1">
          {loading ? (
            <Box className="flex justify-center items-center py-8">
              <Loader type="dots" color="teal" size="lg" />
            </Box>
          ) : error ? (
            <Text c="red" ta="center" py={10}>
              Failed to load announcements
            </Text>
          ) : announcements.length === 0 ? (
            <Text c="dimmed" ta="center" py={10}>
              No announcements available
            </Text>
          ) : (
            announcements.map((item) => (
              <Accordion.Item key={item.uid} value={item.uid} className="mb-2">
                <Accordion.Control className="px-4 hover:bg-gray-50">
                  <Group justify="space-between">
                    <Text fw={500}>{item.name}</Text>
                  </Group>
                </Accordion.Control>

                <Accordion.Panel className="px-2 pb-4 border-x-2 border-[#8d8d4f] bg-gray-100">
                  <Group mb="sm" gap="xs">
                    <IconUser size={16} className="text-gray-500" />
                    <Text size="sm" c="dimmed">
                      {item.creator_name}
                    </Text>
                  </Group>

                  <Group mb="sm" gap="xs">
                    <IconCalendar size={16} className="text-gray-500" />
                    <Text size="sm" c="dimmed">
                      Created: {formatDate(item.create_at, true)}
                    </Text>
                  </Group>

                  <Text
                    size="sm"
                    className="bg-gray-50 p-3 max-h-[220px] overflow-y-auto scrollbar-custom border rounded"
                  >
                    {item.descriptions}
                  </Text>

                  <Group justify="flex-end" mt="md">
                    <Button
                      size="xs"
                      variant="light"
                      color="orange"
                      onClick={() => handleModalOpen(item)}
                    >
                      Review
                    </Button>
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
            ))
          )}
        </Accordion>
      </ScrollArea.Autosize>

      <Box className="flex justify-center pb-2">
        <Button
          variant="subtle"
          size="sm"
          onClick={() => navigate("/announcements")}
        >
          View All Announcements
        </Button>
      </Box>

      <Modal
        opened={opened}
        onClose={close}
        centered
        size="lg"
        title={
          <Text fw={600}>
            Reviewing Announcement:
            <span className="text-teal-600"> {selectedAnnouncement?.name}</span>
          </Text>
        }
      >
        {selectedAnnouncement && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <Text fw={500}>Creator:</Text>
              <Text>{selectedAnnouncement.creator_name}</Text>
            </div>

            <div className="flex justify-between">
              <Text fw={500}>Department:</Text>
              <Text>{selectedAnnouncement.department_name}</Text>
            </div>

            <div className="flex justify-between">
              <Text fw={500}>Created:</Text>
              <Text>{formatDate(selectedAnnouncement.create_at, true)}</Text>
            </div>

            <div className="flex justify-between">
              <Text fw={500}>Status:</Text>
              <AppApprovalStatus status={selectedAnnouncement.is_approved} />
            </div>

            <Divider my="sm" />
            <Text className="bg-gray-50 p-3 rounded text-sm h-[220px] overflow-y-auto scrollbar-custom">
              {selectedAnnouncement.descriptions}
            </Text>

            <Group justify="space-between" mt="xl">
              <Button
                variant="outline"
                color="red"
                leftSection={<IconX size={16} />}
              >
                Reject
              </Button>
              <Button color="teal" leftSection={<IconCheck size={16} />}>
                Approve
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NoticeSection;
