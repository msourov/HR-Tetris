import { Card, Pill, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LeaveReviewModal from "./ReviewModal";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import dayjs from "dayjs";
import LeaveDetail from "../LeaveDetail";

interface LeaveData {
  employee_id: string;
  employee_name: string;
  uid: string;
  purpose: string;
  leave_type: string;
  leave_start_date: string;
  leave_end_date: string;
  is_approved: string;
}

const CustomCard: React.FC<LeaveData> = ({
  employee_id,
  employee_name,
  uid,
  purpose,
  leave_type,
  leave_start_date,
  leave_end_date,
  is_approved,
}: LeaveData) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewLeaveOpened, { open: viewOpen, close: viewClose }] =
    useDisclosure(false);

  const formatDate = (dateString: string): string => {
    const date = dayjs(dateString);
    return date.isValid() ? date.format("MMM D, YYYY h:mm A") : "Invalid Date";
  };

  const isSameDay = (start: string, end: string): boolean => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    return startDate.isValid() && endDate.isValid()
      ? startDate.isSame(endDate, "day")
      : false;
  };

  return (
    <Card className="w-full px-6 border border-gray-200 rounded-lg shadow-lg flex flex-row">
      {/* Left section (80%) */}
      <div className="w-5/6 pr-4">
        <p className="text-lg font-medium">
          {employee_name}{" "}
          <span className="mt-1 text-amber-600">{`(${leave_type})`}</span>
        </p>
        <p className="mt-1 text-gray-500">{purpose}</p>
        <div>
          {isSameDay(leave_start_date, leave_end_date) ? (
            <div className="mt-2 space-y-1">
              <Pill className="bg-blue-100 text-blue-800">
                {formatDate(leave_start_date)}
              </Pill>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Duration:</span>
                <span className="font-mono">
                  {dayjs(leave_start_date).format("HH:mm")} -{" "}
                  {dayjs(leave_end_date).format("HH:mm")}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Pill className="bg-blue-100 text-blue-800">
                  {formatDate(leave_start_date)}
                </Pill>
                <span className="text-gray-400">→</span>
                <Pill className="bg-blue-100 text-blue-800">
                  {formatDate(leave_end_date)}
                </Pill>
              </div>
              <Pill className="text-sm text-white bg-sky-500">
                {dayjs(leave_end_date).diff(dayjs(leave_start_date), "day")}{" "}
                days
              </Pill>
            </div>
          )}
        </div>
      </div>
      {/* Right section (20%) */}
      <div className="w-1/6 flex flex-col items-end">
        <AppApprovalStatus status={is_approved} />
        <div className="mt-auto flex flex-col gap-2">
          {is_approved === "pending" && (
            <Button
              onClick={open}
              variant="light"
              size="compact-sm"
              w={70}
              className="font-thin"
            >
              Review
            </Button>
          )}
          <Button
            variant="filled"
            color="blue"
            w={70}
            size="compact-sm"
            fw={500}
            onClick={viewOpen}
          >
            View
          </Button>
        </div>
      </div>
      {/* View Leave Model */}
      <Modal
        opened={viewLeaveOpened}
        withCloseButton={false}
        onClose={viewClose}
        size="xl"
      >
        <LeaveDetail uid={uid} closeModal={viewClose} />
      </Modal>

      {/* Leave Review Modal */}
      <Modal
        opened={opened}
        onClose={close}
        // withCloseButton={false}
        centered
        title={
          <p className="text-gray-400">
            Reviewing Leave Request of employee{" "}
            <span className="text-blue-500 font-bold">{employee_id}</span>
          </p>
        }
      >
        <LeaveReviewModal close={close} uid={uid} />
      </Modal>
    </Card>
  );
};

export default CustomCard;
