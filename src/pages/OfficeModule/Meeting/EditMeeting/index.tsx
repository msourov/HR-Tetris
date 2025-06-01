import MeetingForm from "../AddMeeting/MeetingForm";

const EditMeeting = ({
  selectedMeeting,
  close,
}: {
  selectedMeeting: string;
  close: () => void;
}) => {
  return <MeetingForm meetingId={selectedMeeting} close={close} />;
};

export default EditMeeting;
