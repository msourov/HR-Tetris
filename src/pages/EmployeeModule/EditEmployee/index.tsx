import { Box, Paper, Tabs } from "@mantine/core";
import { useState } from "react";
import EmployeeForm from "../EmployeeForm";

const EditEmployee = () => {
  const [activeTab, setActiveTab] = useState<string>("1");
  const handleTab = (operation: string) => {
    const newTabIndex =
      operation === "increase"
        ? Math.min(parseInt(activeTab) + 1, 3)
        : Math.max(parseInt(activeTab) - 1, 1);

    setActiveTab(newTabIndex.toString());
  };

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
    }
  };

  return (
    <Paper radius="md" p="xl" className="max-h-['95%']">
      <Tabs
        color="blue"
        variant="pills"
        value={activeTab}
        onChange={handleTabChange}
        orientation="vertical"
      >
        <Tabs.List>
          <Tabs.Tab value="1">Personal Information</Tabs.Tab>
          <Tabs.Tab value="2">Work Information</Tabs.Tab>
          <Tabs.Tab value="3">Authority</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={activeTab} className="ml-4">
          <Box className="flex-1 mx-6">
            <EmployeeForm tab={activeTab} handleTab={handleTab} type={"edit"} />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default EditEmployee;
