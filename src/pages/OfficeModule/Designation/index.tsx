import { Box, Button, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMdReturnLeft } from "react-icons/io";
import { LuPlusCircle } from "react-icons/lu";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../../components/ui/AppModal";
import AddNewDesignation from "./AddNewDesignation";

const DesignationLayout = () => {
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
  const isDetailPage = matchPath("/designations/:id/detail", location.pathname);

  return (
    <Box className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg py-6 px-10">
      {isDetailPage ? (
        <Outlet />
      ) : (
        <>
          <div className="flex justify-between md:mr-8 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center shadow-md bg-white justify-center gap-1 border border-white/20 text-gray-600 hover:bg-gray-200 rounded py-[4px] text-xs w-[65px]"
            >
              <IoMdReturnLeft size={16} color="gray" />
              Back
            </button>
            <Button
              leftSection={<LuPlusCircle />}
              variant="filled"
              onClick={addOpen}
            >
              Add
            </Button>
          </div>
          <AppModal
            opened={addOpened}
            onClose={addClose}
            size="xl"
            title="Add Department"
          >
            <AddNewDesignation toggleModal={toggleModal} />
          </AppModal>
          <Tabs
            radius="xs"
            variant="pills"
            color="orange"
            value={activeTab}
            onChange={handleTabChange}
          >
            <Tabs.List>
              <Tabs.Tab
                value="list"
                leftSection={<IconList style={iconStyle} />}
              >
                Designations
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
        </>
      )}
    </Box>
  );
};

export default DesignationLayout;
