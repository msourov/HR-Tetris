import { Card, Text, Pill, Button, Modal } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useDisclosure } from "@mantine/hooks";
import OvertimeReviewModal from "./ReviewModal";
import dayjs from "dayjs";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import useFormatDate from "../../../../services/utils/useFormatDate";

interface OvertimeData {
  employee_id: string;
  employee_name: string;
  uid: string;
  purpose: string;
  start_time: string;
  end_time: string;
  is_approved: string;
  error?:
    | {
        error: string;
        status: string;
      }
    | FetchBaseQueryError
    | SerializedError;
}

const CustomCard: React.FC<OvertimeData> = ({
  employee_name,
  uid,
  purpose,
  start_time,
  end_time,
  is_approved,
}: OvertimeData) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { formatDate } = useFormatDate();

  const formattedStartDate = formatDate(start_time);
  const formattedEndDate = formatDate(end_time);
  const formattedStartTime = dayjs(start_time).format("h:mm A");
  const formattedEndTime = dayjs(end_time).format("h:mm A");

  return (
    <Card className="w-full px-6 border border-gray-200 rounded-lg shadow-lg flex flex-row">
      {/* Left section (80%) */}
      <div className="w-5/6 pr-4">
        <Text className="text-lg font-semibold">{employee_name}</Text>
        <Text className="mt-2 text-gray-700">{purpose}</Text>
        {dayjs(start_time).isSame(dayjs(end_time), "day") ? (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              <Pill className="text-sm mb-2 text-blue-500 font-mono">
                {formattedStartDate}
              </Pill>
            </Text>
            <Text className="text-sm font-medium">
              <Pill className="text-sm text-gray-600 font-mono">
                {formattedStartTime}
              </Pill>
              <Text span c="blue" className="font-bold w-10">
                {" "}
                -{" "}
              </Text>
              <Pill className="text-sm text-gray-600 font-mono">
                {formattedEndTime}
              </Pill>
            </Text>
          </div>
        ) : (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              <Pill className="text-sm mb-2 text-blue-500 font-mono">
                {formattedStartDate} - {formattedEndDate}
              </Pill>
            </Text>
            <Text className="text-sm">
              <Pill className="text-sm mb-2 text-blue-500 font-mono">
                {formattedStartTime} - {formattedEndTime}
              </Pill>
            </Text>
          </div>
        )}
      </div>

      {/* Right section (20%) */}
      <div className="w-1/6 flex flex-col items-end justify-start gap-4">
        <AppApprovalStatus status={is_approved} />
        {is_approved === "pending" && (
          <Button
            onClick={open}
            variant="filled"
            color="blue"
            size="compact-sm"
          >
            Review
          </Button>
        )}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        centered
        title={
          <Text c="dimmed">
            Reviewing Overtime Request of employee{" "}
            <span className="text-blue-500 font-bold">{employee_name}</span>
          </Text>
        }
      >
        <OvertimeReviewModal close={close} uid={uid} />
      </Modal>
    </Card>
  );
};

export default CustomCard;
