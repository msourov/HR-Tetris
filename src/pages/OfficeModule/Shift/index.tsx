import { Box, Button, Modal, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AppPageHeader from "../../../components/core/AppPageHeader";
import { LuPlus } from "react-icons/lu";
import AddShift from "./AddShift";
import { useDisclosure } from "@mantine/hooks";

const ShiftLayout = () => {
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
    <Box className="w-[95%] lg:w-[90%] flex flex-col mx-auto rounded-lg drop-shadow-lg"> {/* removed h-[calc(90vh-80px)] */}
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Shift"
          Breadcrumb={{ module: "Office Management", page: "Shift" }}
          ShowAddButton={false}
        />
        <Button
          leftSection={<LuPlus />}
          variant="filled"
          onClick={addOpen}
          className="my-10"
        >
          Add Shift
        </Button>
      </div>
      <Modal opened={addOpened} onClose={addClose} size="80%">
        <AddShift toggleModal={toggleModal} />
      </Modal>
      <Tabs
        radius="xs"
        value={activeTab}
        onChange={handleTabChange}
        color="orange"
      >
        <Tabs.List>
          <Tabs.Tab value="list" leftSection={<IconList style={iconStyle} />}>
            Shifts
          </Tabs.Tab>
          <Tabs.Tab
            value="manage"
            leftSection={<IconSettings style={iconStyle} />}
          >
            Manage
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="list">
          <Outlet />
        </Tabs.Panel>
        <Tabs.Panel value="manage">
          <Outlet />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default ShiftLayout;
