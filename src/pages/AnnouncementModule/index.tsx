import { Button, Modal, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuPlusCircle } from "react-icons/lu";
import AddNewAnnouncement from "./AddNewAnnouncement";
import { useDisclosure } from "@mantine/hooks";

const AnnouncementLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>("list");
  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false);

  const toggleModal = () => {
    addClose();
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setActiveTab("manage");
    } else {
      setActiveTab("list");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    if (value === "manage") {
      navigate("edit");
    } else {
      navigate("");
    }
  };

  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div className="w-[95%] h-[calc(90vh-80px)] flex flex-col my-8 mx-auto rounded-lg drop-shadow-lg py-6 px-4">
      <div className="flex justify-end md:mr-8">
        <Button
          leftSection={<LuPlusCircle />}
          variant="filled"
          onClick={addOpen}
        >
          Add
        </Button>
      </div>
      <Modal
        opened={addOpened}
        onClose={addClose}
        size="xl"
        title="Create Announcement"
      >
        <AddNewAnnouncement toggleModal={toggleModal} />
      </Modal>
      <Tabs
        variant="pills"
        radius="xs"
        value={activeTab}
        onChange={handleTabChange}
        orientation="horizontal"
        className=" px-2 lg:px-4 h-full flex flex-col"
      >
        <Tabs.List className="shrink-0">
          <Tabs.Tab value="list" leftSection={<IconList style={iconStyle} />}>
            Announcements
          </Tabs.Tab>
          <Tabs.Tab
            value="manage"
            leftSection={<IconSettings style={iconStyle} />}
          >
            Manage
          </Tabs.Tab>
        </Tabs.List>
        <div className="flex-1 overflow-y-auto min-h-0">
          <Tabs.Panel value="list" className="px-4 lg:px-6 lg:m-4 h-[90%]">
            <Outlet />
          </Tabs.Panel>
          <Tabs.Panel value="manage" className="px-4 lg:px-6">
            <Outlet />
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
};

export default AnnouncementLayout;
