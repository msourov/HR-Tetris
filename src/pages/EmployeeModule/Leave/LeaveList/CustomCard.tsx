import { Card, Text, Badge, Pill, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LeaveReviewModal from "./ReviewModal";
import { IconXboxX } from "@tabler/icons-react";

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full px-6 border border-gray-200 rounded-lg shadow-lg flex flex-row">
      {/* Left section (80%) */}
      <div className="w-5/6 pr-4">
        <Text className="text-lg font-medium">
          {employee_name}{" "}
          <Text span className="mt-1 text-amber-600">
            {`(${leave_type})`}
          </Text>
        </Text>
        <Text className="mt-1 text-gray-500">{purpose}</Text>
        {new Date(leave_start_date).toLocaleDateString() ===
        new Date(leave_end_date).toLocaleDateString() ? (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm font-semibold">
              <Pill className="text-sm mb-2 text-blue-500">
                {formatDate(leave_start_date)}
              </Pill>
            </Text>
            <Text className="text-sm font-medium">
              <Pill className="text-sm text-gray-600">
                {formatDate(leave_start_date)}
              </Pill>
              <Text span c="blue" className="font-bold w-10">
                {" "}
                -{" "}
              </Text>
              <Pill className="text-sm text-gray-600">
                {formatDate(leave_end_date)}
              </Pill>
            </Text>
          </div>
        ) : (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              <Pill className=" text-sm mb-2 text-blue-500">
                {new Date(leave_start_date).toLocaleDateString()} -{" "}
                {new Date(leave_end_date).toLocaleDateString()}
              </Pill>
            </Text>
            <Text className="text-sm">
              {/* <Text span c="blue" className="font-bold ">
                To:{" "}
              </Text> */}
              <Pill className="text-sm mb-2 text-gray-400">
                {new Date(leave_end_date).toLocaleTimeString()} -{" "}
                {new Date(leave_start_date).toLocaleTimeString()}
              </Pill>
            </Text>
          </div>
        )}
      </div>
      {/* Right section (20%) */}
      <div className="w-1/6 flex flex-col items-end justify-start gap-4">
        <Badge
          className={`px-2 py-1 text-xs font-semibold ${
            is_approved === "approved"
              ? "bg-green-100 text-green-700"
              : is_approved === "reject" || is_approved === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-500"
          }`}
          size="lg"
        >
          {is_approved === "pending"
            ? is_approved.toUpperCase()
            : is_approved === "reject"
            ? "REJECTED"
            : is_approved.toUpperCase()}
        </Badge>
        {is_approved === "pending" && (
          <Button onClick={open} variant="light" size="sm">
            Review
          </Button>
        )}
      </div>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        closeButtonProps={{
          icon: <IconXboxX size={20} stroke={1.5} />,
        }}
        centered
        title={
          <Text c="dimmed">
            Reviewing Leave Request of employee{" "}
            <span className="text-blue-500 font-bold">{employee_id}</span>
          </Text>
        }
      >
        <LeaveReviewModal close={close} uid={uid} />
      </Modal>
    </Card>
  );
};

export default CustomCard;
