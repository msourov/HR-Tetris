import { Button, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import AddNewAnnouncement from "./AddNewAnnouncement";
import { useDisclosure } from "@mantine/hooks";
import AppPageHeader from "../../components/core/AppPageHeader";
import AppModal from "../../components/ui/AppModal";

const AnnouncementLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>("list");
  const [addOpened, { open, close }] = useDisclosure(false);

  const toggleModal = () => {
    close();
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

  const path = location.pathname.split("/");
  const disableAdd = ["add", "edit", "create", "detail"].includes(
    path[path.length - 1].split("-")[0]
  );

  console.log(disableAdd, "disableAdd");

  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Announcements"
          Breadcrumb={{
            module: "Announcement Management",
            page: "Announcements",
          }}
          ShowAddButton={false}
        />
        {!disableAdd && (
          <Button
            leftSection={<LuPlus size={18} />}
            variant="filled"
            onClick={open}
            className="my-10"
          >
            Create Announcement
          </Button>
        )}
      </div>
      <AppModal
        opened={addOpened}
        onClose={close}
        size="xl"
        title="Create Announcement"
      >
        <AddNewAnnouncement toggleModal={toggleModal} />
      </AppModal>
      <Tabs
        variant="pills"
        radius="xs"
        value={activeTab}
        onChange={handleTabChange}
        orientation="horizontal"
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
          <Tabs.Panel value="list">
            <Outlet />
          </Tabs.Panel>
          <Tabs.Panel value="manage">
            <Outlet />
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
};

export default AnnouncementLayout;
