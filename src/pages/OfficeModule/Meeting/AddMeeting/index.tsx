import MeetingForm from "./MeetingForm";

type AddMeetingProps = {
  close: () => void;
};

const AddMeeting = ({ close }: AddMeetingProps) => {
  return <MeetingForm close={close} />;
};

export default AddMeeting;
