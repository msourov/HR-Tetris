import { Box, Button, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { useDisclosure } from "@mantine/hooks";
import AppModal from "../../../components/ui/AppModal";
import AddNewDesignation from "./AddNewDesignation";
import AppPageHeader from "../../../components/core/AppPageHeader";

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
    <Box className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      {isDetailPage ? (
        <Outlet />
      ) : (
        <>
          <div className="flex justify-between">
            <AppPageHeader
              Heading="Designation"
              Breadcrumb={{ module: "Admin Management", page: "Designation" }}
              ShowAddButton={false}
            />
            <Button
              leftSection={<LuPlus size={18} />}
              variant="filled"
              onClick={addOpen}
              className="my-10"
            >
              Add Designation
            </Button>
          </div>

          <AppModal
            opened={addOpened}
            onClose={addClose}
            size="xl"
            title="Add Designation"
          >
            <AddNewDesignation toggleModal={toggleModal} />
          </AppModal>
          <Tabs
            radius="xs"
            // variant="pills"
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
