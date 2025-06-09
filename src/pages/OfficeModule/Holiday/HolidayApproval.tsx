import { Button, Card, Group, Stack, Text } from "@mantine/core";
import useFormatDate from "../../../services/utils/useFormatDate";
import { Holiday } from "../../../features/types/holiday";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import AppModal from "../../../components/ui/AppModal";
import HolidayReviewModal from "./HolidayReivewModal";

const HolidayApproval = ({ holidays }: { holidays: Holiday[] }) => {
  const { formatDate } = useFormatDate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  const handleReview = (uid: string) => {
    setSelectedUid(uid);
    open();
  };

  return (
    <>
      <Stack gap="md">
        {holidays.map((holiday) => (
          <Card key={holiday.uid} withBorder shadow="xs" p="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={600} size="md">
                  {holiday.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {formatDate(holiday.holiday_start_at)} -{" "}
                  {formatDate(holiday.holiday_end_at)}
                </Text>
              </div>
              <Button
                variant="light"
                size="compact-sm"
                color="green"
                className="my-auto text-xs"
                onClick={() => handleReview(holiday.uid)}
              >
                Review
              </Button>
            </Group>
          </Card>
        ))}
      </Stack>
      {selectedUid && (
        <AppModal
          withCloseButton={true}
          opened={opened}
          onClose={close}
          title="Review Holiday Request"
          centered
          size="sm"
        >
          <HolidayReviewModal uid={selectedUid} close={close} />
        </AppModal>
      )}
    </>
  );
};

export default HolidayApproval;
