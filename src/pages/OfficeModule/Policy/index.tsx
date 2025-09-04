import { Box, Button, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMdReturnLeft } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { modals } from "@mantine/modals";

const PolicyLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>("list");

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

  const handleAddButtonClick = () => {
    modals.openContextModal({
      modal: "demonstration",
      centered: true,
      innerProps: {
        // modalBody:
        //   "This modal was defined in ModalsProvider, you can open it anywhere in you app with useModals hook",
      },
    });
  };

  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <Box className="w-[95%] h-[calc(90vh-80px)] flex flex-col my-6 mx-auto rounded-lg drop-shadow-lg py-6 px-4">
      <div className="flex justify-between md:mr-8 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-1 border border-white/20 hover:bg-gray-200 rounded w-[70px]"
        >
          <IoMdReturnLeft size={14} color="black" />
          Back
        </button>
        <Button
          leftSection={<LuPlus size={18} />}
          variant="filled"
          onClick={handleAddButtonClick}
        >
          Add
        </Button>
      </div>
      <Tabs
        radius="xs"
        value={activeTab}
        onChange={handleTabChange}
        variant="pills"
        color="orange"
      >
        <Tabs.List>
          <Tabs.Tab value="list" leftSection={<IconList style={iconStyle} />}>
            Policy
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

export default PolicyLayout;
