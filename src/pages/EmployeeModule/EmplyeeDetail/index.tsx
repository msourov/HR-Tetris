import { useParams } from "react-router-dom";
import { useGetEmployeeDetailQuery } from "../../../features/api/employeeSlice";
import {
  Container,
  Grid,
  Text,
  Title,
  Badge,
  Avatar,
  Stepper,
  Group,
  Divider,
  Box,
  Loader,
} from "@mantine/core";
import ErrorAlert from "../../../components/shared/ErrorAlert";

const EmployeeDetail = () => {
  const { uid } = useParams();
  const {
    data: employee,
    isLoading,
    error,
  } = useGetEmployeeDetailQuery({ uid });

  const logsSteps = (
    Array.isArray(employee?.data?.logs) ? employee.data.logs : []
  )
    .filter(Boolean)
    .map((log, index) => (
      <Stepper.Step
        key={index}
        label={log?.admin ?? "N/A"}
        description={log?.message ?? "N/A"}
      >
        <Text size="sm" c="dimmed">
          <Text fw="bold">
            Created:{" "}
            <Text span className="text-blue-700">
              {log?.create_at
                ? new Date(log.create_at).toLocaleString()
                : "N/A"}
            </Text>
          </Text>
        </Text>
      </Stepper.Step>
    ));

  if (isLoading) {
    return (
      <div className="flex justify-center my-auto">
        <Loader type="dots" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={"Error fetching employee detail"} />;
  }

  return (
    <Container size="xl" my="xl">
      <Grid className="flex justify-evenly">
        {/* Left Column: Personal and Work Information */}
        <Grid.Col span={8}>
          {/* Personal Information */}
          <Group align="flex-start" mb="lg">
            <Avatar
              size={120}
              radius="xl"
              src={`https://avatar.iran.liara.run/public`}
            />
            <div>
              <Title order={2}>{employee?.data.name}</Title>
              <Text color="dimmed" size="sm">
                {employee?.data.designation.name} -{" "}
                {employee?.data.department.name}
              </Text>
              <Badge color="green" variant="light">
                {employee?.data.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </Group>

          <Title order={4} mb="xs">
            Personal Information
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <Text>
                <strong>Phone:</strong> {employee?.data.phone}
              </Text>
              <Text>
                <strong>Email:</strong> {employee?.data.email}
              </Text>
              <Text>
                <strong>Date of Birth:</strong>{" "}
                {employee?.data.bod
                  ? new Date(employee.data.bod).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>
                <strong>Marital Status:</strong> {employee?.data.marital_status}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Home Address:</strong> {employee?.data.address}
              </Text>
              <Text>
                <strong>Spouse Name:</strong> {employee?.data.spouse_name}
              </Text>
            </Grid.Col>
          </Grid>

          {/* Work Information */}
          <Title order={4} mt="lg" mb="xs">
            Work Information
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <Text>
                <strong>Employee ID:</strong> {employee?.data.employee_id}
              </Text>
              <Text>
                <strong>Company:</strong> {employee?.data.company?.name}
              </Text>
              <Text>
                <strong>Joining Date:</strong>{" "}
                {employee?.data.joining_date
                  ? new Date(employee.data.joining_date).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>
                <strong>Salary:</strong> $
                {employee?.data.salary?.toFixed(2) ?? "N/A"}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>
                <strong>Work Location:</strong> {employee?.data.work_location}
              </Text>
              <Text>
                <strong>Work Email:</strong> {employee?.data.work_email}
              </Text>
              <Text>
                <strong>Shift & Schedule:</strong>{" "}
                {employee?.data.shift_and_schedule.name}
              </Text>
              <Text>
                <strong>Is Supervisor:</strong>{" "}
                {employee?.data.supervisor ? "Yes" : "No"}
              </Text>
            </Grid.Col>
          </Grid>

          {/* Emergency Contact */}
          <Title order={4} mt="lg" mb="xs">
            Emergency Contact
          </Title>
          <Grid>
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
        </Grid.Col>

        {/* Divider between columns */}
        <Divider orientation="vertical" />

        {/* Right Column: Activity Logs as Stepper */}
        <Grid.Col span={3} className="flex justify-center mx-auto">
          {" "}
          {/* Added ml-10 for left margin */}
          <Box className="border px-8 py-4 bg-blue-100">
            <Title
              order={4}
              fw={500}
              mb="md"
              c="dimmed"
              ta="center"
              className="border-b-2 py-2 border-white"
            >
              Activity Logs
            </Title>
            <Stepper
              color="blue"
              orientation="vertical"
              size="sm"
              active={logsSteps.length - 1}
            >
              {logsSteps}
            </Stepper>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default EmployeeDetail;
