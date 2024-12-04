import { Card, Text, Badge, Pill, Button, Modal } from "@mantine/core";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useDisclosure } from "@mantine/hooks";
import OvertimeReviewModal from "./ReviewModal";

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

  return (
    <Card className="w-full px-6 border border-gray-200 rounded-lg shadow-lg flex flex-row">
      {/* Left section (80%) */}
      <div className="w-5/6 pr-4">
        <Text className="text-lg font-semibold">{employee_name}</Text>
        <Text className="mt-2 text-gray-700">{purpose}</Text>
        {new Date(start_time).toLocaleDateString() ===
        new Date(end_time).toLocaleDateString() ? (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              <Pill className=" text-sm mb-2 text-blue-500">
                {new Date(start_time).toLocaleDateString()}
              </Pill>
            </Text>
            <Text className="text-sm font-medium">
              <Pill className="text-sm text-gray-600">
                {new Date(start_time).toLocaleTimeString()}
              </Pill>
              <Text span c="blue" className="font-bold w-10">
                {" "}
                -{" "}
              </Text>
              <Pill className="text-sm text-gray-600">
                {new Date(end_time).toLocaleTimeString()}
              </Pill>
            </Text>
          </div>
        ) : (
          <div className="flex flex-col text-gray-600 mt-2">
            <Text className="text-sm">
              <Pill className=" text-sm mb-2 text-blue-500">
                {new Date(start_time).toLocaleDateString()} -{" "}
                {new Date(end_time).toLocaleTimeString()}
              </Pill>
            </Text>
            <Text className="text-sm">
              {/* <Text span c="blue" className="font-bold ">
                To:{" "}
              </Text> */}
              <Pill className="text-sm mb-2 text-blue-500">
                {new Date(end_time).toLocaleDateString()} -{" "}
                {new Date(start_time).toLocaleTimeString()}
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
              : "bg-yellow-100 text-yellow-600"
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
          <Button onClick={open} variant="light" size="compact-sm">
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
