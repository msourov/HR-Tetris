// AnnouncementDetails.tsx
import { Button, Card, Pill, Textarea } from "@mantine/core";
import { Announcement } from "../../../features/types/announcement";
import AppApprovalStatus from "../../../components/core/AppApprovalStatus";

interface AnnouncementDetailsProps {
  announcement: Announcement;
  value: string;
  setValue: (value: string) => void;
  handleApproveAnnouncement: (uid: string) => void;
  handleRejectAnnouncement: (uid: string) => void;
}

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({
  announcement,
  value,
  setValue,
  handleApproveAnnouncement,
  handleRejectAnnouncement,
}) => {
  return (
    <>
      <Card className="p-0">
        <p className="font-medium text-xl text-center mb-4 text-[#212922]">
          {announcement.name}
        </p>
        <Textarea
          autosize
          minRows={4}
          maxRows={12}
          className="font-medium text-md text-gray-600 text-left mb-4 py-4"
        >
          {announcement.descriptions}
        </Textarea>
        <p className="text-left text-sm text-gray-500">
          Created by{" "}
          <span className="text-blue-600">{announcement.creator_name}</span>
        </p>
        <p>
          <Pill size="md" className="text-gray-500 my-4">
            {announcement.department_name}
          </Pill>
        </p>
      </Card>
      {announcement.is_approved === "pending" && (
        <Textarea
          variant="filled"
          placeholder="Reason for rejection"
          className="w-[95%] mb-6 mx-auto"
          mb={20}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      )}
      {announcement.is_approved === "pending" ? (
        <div className="flex justify-end gap-4">
          <Button
            variant="filled"
            bg="blue"
            onClick={() => handleApproveAnnouncement(announcement.uid)}
          >
            Approve
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={() => handleRejectAnnouncement(announcement.uid)}
          >
            Reject
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-4">
          <AppApprovalStatus status={announcement?.is_approved} />
        </div>
      )}
    </>
  );
};

export default AnnouncementDetails;
