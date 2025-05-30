import { Button } from "@mantine/core";
import AppPageHeader from "../../../components/core/AppPageHeader";
import MeetingList from "./MeetingList";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../../components/ui/AppModal";
import AddMeeting from "./AddMeeting";

const MeetingLayout = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <div className="flex justify-between items-center mr-16">
        <div className="relative">
          <AppPageHeader
            Heading="Meeting"
            Breadcrumb={{ module: "Office Management", page: "Meeting" }}
            ShowAddButton={false}
          />
        </div>

        <Button
          onClick={open}
          color="blue"
          size="compact-md"
          className="text-sm"
        >
          Create Meeting
        </Button>
      </div>

      <MeetingList />

      <AppModal opened={opened} onClose={close} withCloseButton={false}>
        <AddMeeting close={close}/>
      </AppModal>
    </div>
  );
};

export default MeetingLayout;
