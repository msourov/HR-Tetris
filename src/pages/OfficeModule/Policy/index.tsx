import { Box, rem, Tabs } from "@mantine/core";
import { IconList, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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

  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <Box className="w-[95%] my-8 mx-auto rounded-lg drop-shadow-lg py-6 px-10">
      <Tabs
        radius="xs"
        value={activeTab}
        onChange={handleTabChange}
        variant="pills"
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
