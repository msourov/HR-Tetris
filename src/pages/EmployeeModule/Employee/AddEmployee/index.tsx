import { Paper, Box, Tabs } from "@mantine/core";
import { useState } from "react";
import { randomId } from "@mantine/hooks";
import EmployeeForm from "../EmployeeForm";

const initialPermissionValues = [
  {
    label: "Attendance",
    name: "attendance_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Overtime",
    name: "overtime_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Home Office",
    name: "home_office_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Accounts",
    name: "accounts_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Leave",
    name: "leave_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Announcement",
    name: "announcement_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Certification",
    name: "certification_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Loan Equipments",
    name: "loan_equipment_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Reports",
    name: "reports_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Ticket",
    name: "ticket_management",
    checked: true,
    key: randomId(),
  },
  {
    label: "Recruitment",
    name: "recruitment_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Employee Admin",
    name: "employee_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Overtime Approval",
    name: "overtime_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Home Office Approval",
    name: "home_office_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Accounts Admin",
    name: "accounts_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Leave Approval",
    name: "leave_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Announcement Approval",
    name: "announcement_approve_management",
    checked: false,
    key: randomId(),
  },

  {
    label: "Certification Approval",
    name: "certification_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Loan Equipments Approval",
    name: "loan_equipment_approve_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Reports",
    name: "reports_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Ticket Admin",
    name: "ticket_admin_management",
    checked: false,
    key: randomId(),
  },
  {
    label: "Consumable",
    name: "consumable_management",
    checked: true,
    key: randomId(),
  },
];

const AddEmployee = () => {
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
        className="min-h-[50vh]"
      >
        <Tabs.List>
          <Tabs.Tab value="1">Personal Information</Tabs.Tab>
          <Tabs.Tab value="2">Work Information</Tabs.Tab>
          <Tabs.Tab value="3">Authority</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={activeTab} className="ml-4">
          <Box className="flex-1 mx-6">
            <EmployeeForm
              tab={activeTab}
              handleTab={handleTab}
              type={"add"}
              initialPermissionValues={initialPermissionValues}
            />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default AddEmployee;
