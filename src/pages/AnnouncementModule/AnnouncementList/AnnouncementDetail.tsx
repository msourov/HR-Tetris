// AnnouncementDetails.tsx
import { Button, Card, Pill, Textarea } from "@mantine/core";
import { Announcement } from "../../../features/api/typesOld";

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
      <Card>
        <p className="font-medium text-xl text-center mb-4 text-[#212922]">
          {announcement.name}
        </p>
        <p className="font-medium text-md text-gray-500 text-left mb-6 border px-2 py-4 text-[#212922]">
          {announcement.descriptions}
        </p>
        <p className="text-left text-sm">
          Created By {announcement.creator_name}
        </p>
        <p>
          <Pill size="md" className="text-gray-500 my-10">
            {announcement.department_name}
          </Pill>
        </p>
      </Card>
      {announcement.is_approve === "pending" && (
        <Textarea
          variant="filled"
          placeholder="Reason for rejection"
          className="w-[95%] mb-6 mx-auto"
          mb={20}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      )}
      {announcement.is_approve === "pending" ? (
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
          <Pill className="bg-green-300 text-green-900 font-bold">
            Approved
          </Pill>
        </div>
      )}
    </>
  );
};

export default AnnouncementDetails;
