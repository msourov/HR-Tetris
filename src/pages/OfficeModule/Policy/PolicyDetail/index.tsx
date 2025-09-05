import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  ScrollArea,
  Text,
} from "@mantine/core";
import PDFViewer from "../PolicyList/PDFViewer";
import { AllPolicy } from "../../../../features/types/policy";
import { IconCalendar, IconUser, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "./detail.module.css";

interface PolicyModalProps {
  opened: boolean;
  onClose: () => void;
  policyDetail: { data?: AllPolicy } | null;
  policyDetailLoading: boolean;
}

const PolicyDetail: React.FC<PolicyModalProps> = ({
  opened,
  onClose,
  policyDetail,
  policyDetailLoading,
}) => {
  const policy = policyDetail?.data;
  const isFile = !policy?.descriptions;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="80%"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      closeButtonProps={{
        icon: <IconX size={20} />,
      }}
    >
      <LoadingOverlay visible={policyDetailLoading} />

      {policy && (
        <div className="flex flex-col h-full">
          {/* Header with policy info */}
          <Paper withBorder p="md" radius="md" className="mb-6">
            <Group justify="space-between" align="flex-start">
              <div className="flex-1">
                <Text fw={700} size="lg" className="text-gray-800 mb-2">
                  {policy.name}
                </Text>
                <Group gap="lg" mt="sm">
                  <Group gap={4}>
                    <IconCalendar size={16} className="text-gray-500" />
                    <Text size="sm" c="dimmed">
                      Created: {dayjs(policy.create_at).format("MMM D, YYYY")}
                    </Text>
                  </Group>
                </Group>
              </div>
            </Group>
          </Paper>

          {/* Policy Content */}
          {isFile ? (
            <div className="flex-1 mb-6">
              <PDFViewer uid={policy.uid} />
            </div>
          ) : (
            <Paper withBorder p="md" radius="md" className="flex-1 mb-6">
              <ScrollArea className="h-96">
                <div
                  dangerouslySetInnerHTML={{
                    __html: policy.descriptions || "No description available",
                  }}
                  className={`${classes["policy-content"]} prose max-w-none`}
                />
              </ScrollArea>
            </Paper>
          )}

          {/* Log information */}
          {policy.logs && (
            <Paper withBorder p="md" radius="md">
              <Text fw={600} size="md" className="mb-4 text-gray-700">
                Activity Log
              </Text>

              <div className="space-y-3">
                {/* Admin */}
                <Group gap={8} align="center">
                  <IconUser size={16} className="text-gray-500" />
                  <Text size="sm" className="text-gray-700">
                    {policy.logs.admin || "Unknown"}
                  </Text>
                </Group>

                {/* Date */}
                <Group gap={8} align="center">
                  <IconCalendar size={16} className="text-gray-500" />
                  <Text size="sm" className="text-gray-700">
                    {policy.logs.create_at
                      ? dayjs(policy.logs.create_at).format(
                          "MMM D, YYYY h:mm A"
                        )
                      : "Date not available"}
                  </Text>
                </Group>

                {/* Action Message */}
                {policy.logs.message && (
                  <div className="border-l-4 border-blue-500 pl-4 mt-2">
                    <Text size="sm" className="text-gray-700">
                      {policy.logs.message}
                    </Text>
                  </div>
                )}
              </div>
            </Paper>
          )}

          {/* Footer with close button */}
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={onClose} size="md">
              Close
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
};

export default PolicyDetail;
