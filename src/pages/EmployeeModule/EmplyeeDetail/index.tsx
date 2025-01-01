import { useParams } from "react-router-dom";
import { useGetEmployeeDetailQuery } from "../../../features/api/employeeSlice";
import {
  Grid,
  Text,
  Title,
  Badge,
  Avatar,
  Stepper,
  Group,
  Loader,
  Tabs,
  Box,
} from "@mantine/core";
import ErrorAlert from "../../../components/shared/ErrorAlert";
import { MdOutlineWorkOutline, MdPerson } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { useState } from "react";
import { RiArchive2Line } from "react-icons/ri";

const EmployeeDetail = () => {
  const { uid } = useParams();
  const {
    data: employee,
    isLoading,
    error,
  } = useGetEmployeeDetailQuery({ uid });
  const [activeTab, setActiveTab] = useState<string | null>("first");

  const logsSteps = (
    Array.isArray(employee?.data?.logs) ? employee.data.logs : []
  )
    .filter(Boolean)
    .map((log, index) => (
      <Stepper.Step
        key={index}
        label={<Text size="sm">{log?.admin ?? "N/A"}</Text>}
        description={<Text size="xs">{log?.message ?? "N/A"}</Text>}
      >
        {/* <Text size="xs" color="dimmed">
          <Text fw="bold">
            Created:{" "}
            <Text span color="blue">
              {log?.create_at
                ? new Date(log.create_at).toLocaleString()
                : "N/A"}
            </Text>
          </Text>
        </Text> */}
      </Stepper.Step>
    ));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader variant="dots" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message="Error fetching employee details" />;
  }

  return (
    <Box className="p-6 bg-gray-50">
      <Box>
        <Group align="flex-start">
          <Avatar
            size={120}
            radius="xl"
            src={`https://avatar.iran.liara.run/public`}
          />
          <div className="self-center">
            <Title order={3} c="dimmed">
              {employee?.data.personal.name}
            </Title>
            <Text color="dimmed" size="sm">
              {employee?.data.work.designation.name} -{" "}
              {employee?.data.work.department.name}
            </Text>
            <Badge
              color={employee?.data.personal.active ? "green" : "red"}
              variant="light"
            >
              {employee?.data.personal.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Group>
      </Box>
      <Box className="flex justify-between mt-4">
        <Tabs
          color="blue"
          variant="default"
          defaultValue="personal"
          value={activeTab}
          onChange={setActiveTab}
          w={"50%"}
        >
          <Tabs.List className={`w-fit rounded-lg border my-6 bg-white`}>
            <Tabs.Tab value="personal">
              <BsFillPersonVcardFill color="gray" size={20} />
            </Tabs.Tab>
            <Tabs.Tab value="work">
              <MdOutlineWorkOutline color="gray" size={20} />
            </Tabs.Tab>
            <Tabs.Tab value="others">
              <RiArchive2Line color="gray" size={20} />
            </Tabs.Tab>
          </Tabs.List>
          <Box className="p-4 border">
            <Tabs.Panel value="personal">
              <Box>
                <Box>
                  <Text className="text-md flex justify-between">
                    <Text span c="dimmed">
                      Phone:
                    </Text>
                    +88{employee?.data.personal.phone}
                  </Text>
                  <Text className="text-md flex justify-between">
                    <Text span c="dimmed">
                      Email:
                    </Text>
                    {employee?.data.personal.email}
                  </Text>
                  <Text className="text-md flex justify-between">
                    <Text span c="dimmed">
                      Date of birth:
                    </Text>
                    {employee?.data.personal.bod
                      ? new Date(
                          employee.data.personal.bod
                        ).toLocaleDateString()
                      : "N/A"}
                  </Text>
                  <Text className="text-md flex justify-between">
                    <Text span c="dimmed">
                      Marital Status:
                    </Text>
                    {employee?.data.personal.marital_status}
                  </Text>
                </Box>
                <Box>
                  <Text className="text-md flex items-center gap-2">
                    <Text span c="dimmed">
                      Address
                    </Text>
                    {employee?.data.personal.address}
                  </Text>
                  <Text className="text-md flex items-center gap-2">
                    <Text>
                      <MdPerson />
                    </Text>
                    {employee?.data.personal.spouse_name || "N/A"}
                  </Text>
                </Box>
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="work">
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <Text>
                    <strong>Employee ID:</strong>{" "}
                    {employee?.data.work.employee_id}
                  </Text>
                  <Text>
                    <strong>Company:</strong>{" "}
                    {employee?.data.work.company?.name}
                  </Text>
                  <Text>
                    <strong>Joining Date:</strong>{" "}
                    {employee?.data.work.joining_date
                      ? new Date(
                          employee.data.work.joining_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </Text>
                  <Text>
                    <strong>Salary:</strong> $
                    {employee?.data.work.salary?.toFixed(2) ?? "N/A"}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text>
                    <strong>Work Location:</strong>{" "}
                    {employee?.data.work.work_location}
                  </Text>
                  <Text>
                    <strong>Work Email:</strong>{" "}
                    {employee?.data.work.work_email}
                  </Text>
                  <Text>
                    <strong>Shift & Schedule:</strong>{" "}
                    {employee?.data.work.shift_and_schedule.name}
                  </Text>
                  <Text>
                    <strong>Is Supervisor:</strong>{" "}
                    {employee?.data.work.supervisor ? "Yes" : "No"}
                  </Text>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="others">
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <Text>
                    <strong>Contact Name:</strong>{" "}
                    {employee?.data.emergency_contact.name}
                  </Text>
                  <Text>
                    <strong>Contact Relationship:</strong>{" "}
                    {employee?.data.emergency_contact.relationship}
                  </Text>
                  <Text>
                    <strong>Contact Phone:</strong>{" "}
                    {employee?.data.emergency_contact.phone}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text>
                    <strong>Contact Address:</strong>{" "}
                    {employee?.data.emergency_contact.address}
                  </Text>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Box>
        </Tabs>
        <Box p="lg" className="bg-blue-50 border">
          <Title order={4} mb="md" ta="center" c="blue">
            Activity Logs
          </Title>
          {logsSteps.length ? (
            <Stepper
              color="blue"
              orientation="vertical"
              size="xs" // Reduced icon size
              active={logsSteps.length - 1}
              styles={{
                stepIcon: { fontSize: 12 }, // Smaller step icon size
                step: { marginBottom: "1rem" },
                stepBody: { paddingLeft: "0.5rem" },
              }}
            >
              {logsSteps}
            </Stepper>
          ) : (
            <Text color="dimmed" size="sm" ta="center">
              No activity logs available.
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeDetail;
