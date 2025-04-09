import {
  Card,
  Avatar,
  Group,
  Paper,
  Text,
  Badge,
  Divider,
  Stack,
  Loader,
  Button,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDepartmentDetailQuery } from "../../../../features/api/departmentSlice";
import {
  IconAlertCircle,
  IconBuilding,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { IoMdReturnLeft } from "react-icons/io";

const DepartmentDetail = () => {
  const { id: uid } = useParams();
  const { formatDate } = useFormatDate();
  const { data, isLoading, error } = useGetDepartmentDetailQuery({ uid });
  const navigate = useNavigate();

  const departmentDetail = data?.data;

  if (isLoading) {
    return <Loader type="dots" />;
  }

  if (error) {
    return <Text color="red">Failed to load department details.</Text>;
  }

  return (
    <>
      <Button
        variant="outline"
        color="black"
        size="compact-sm"
        leftSection={<IoMdReturnLeft size={16} color="gray" />}
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:bg-gray-200 border-gray-400"
      >
        Back
      </Button>
      <Card withBorder radius="md" p="lg" className="bg-white my-8">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconBuilding size={24} className="text-blue-600" />
            <Text size="xl" fw={700} className="text-gray-800">
              {departmentDetail?.name}
            </Text>
          </Group>
          <Badge
            color={departmentDetail?.active ? "green" : "red"}
            variant="light"
            size="md"
            radius="sm"
          >
            {departmentDetail?.active ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <Divider my="md" />

        {/* Department Metadata */}
        <Stack gap="xs">
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Department ID:
            </Text>
            <Text size="sm" className="font-mono">
              {departmentDetail?.uid}
            </Text>
          </Group>

          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Company ID:
            </Text>
            <Text size="sm" className="font-mono">
              {departmentDetail?.company_id}
            </Text>
          </Group>

          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Created At:
            </Text>
            <Text size="sm">{formatDate(departmentDetail?.create_at)}</Text>
          </Group>

          {departmentDetail?.update_at && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Last Updated:
              </Text>
              <Text size="sm">{formatDate(departmentDetail?.update_at)}</Text>
            </Group>
          )}
        </Stack>

        {/* <Divider my="md" /> */}

        {/* Activity Log */}
        {/* <Paper withBorder p="sm" radius="md" className="bg-gray-50">
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Last Activity:
            </Text>
            <Text size="sm">
              {Array.isArray(departmentDetail?.logs)
                ? departmentDetail?.logs[0]?.message
                : departmentDetail?.logs?.message}
            </Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              By:
            </Text>
            <Text size="sm">{departmentDetail?.logs.admin}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              On:
            </Text>
            <Text size="sm">
              {formatDate(departmentDetail?.logs.create_at, true)}
            </Text>
          </Group>
        </Paper> */}

        <Divider my="md" />

        {/* Employees Section */}
        <Text size="lg" fw={600} className="mb-4">
          Employees
        </Text>

        <Stack gap="sm">
          {departmentDetail?.employees.map((employee) => (
            <Paper
              key={employee.employee_id}
              withBorder
              p="md"
              radius="md"
              className="hover:shadow-md transition-shadow"
            >
              <Group justify="space-between" align="flex-start">
                {/* Employee Info */}
                <Group gap="md" align="flex-start">
                  <Avatar color="blue" radius="xl" size="lg">
                    {employee.name[0]}
                  </Avatar>

                  <Stack gap={2}>
                    <Text fw={600} className="text-gray-800">
                      {employee.name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {employee.designation}
                    </Text>

                    {/* Contact Info */}
                    <Group gap="md" mt={4}>
                      <Group gap={4}>
                        <IconMail size={16} className="text-gray-500" />
                        <Text size="sm" c="dimmed">
                          {employee.email}
                        </Text>
                      </Group>

                      <Group gap={4}>
                        <IconPhone size={16} className="text-gray-500" />
                        <Text size="sm" c="dimmed">
                          {employee.phone}
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Group>

                <Group gap="xs">
                  {employee.supervisor && (
                    <Badge
                      color="teal"
                      variant="light"
                      leftSection={<IconUser size={12} />}
                      radius="sm"
                    >
                      Supervisor
                    </Badge>
                  )}
                  {employee.is_probation && (
                    <Badge
                      color="yellow"
                      variant="light"
                      leftSection={<IconAlertCircle size={12} />}
                      radius="sm"
                    >
                      Probation
                    </Badge>
                  )}
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Card>
    </>
  );
};

export default DepartmentDetail;
