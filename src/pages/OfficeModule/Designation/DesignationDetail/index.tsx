import {
  Card,
  Group,
  Paper,
  Text,
  Badge,
  Divider,
  Stack,
  Button,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconAlertCircle,
  IconBriefcase,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { IoMdReturnLeft } from "react-icons/io";
import { useGetDesignationDetailQuery } from "../../../../features/api/designationSlice";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import AppLoader from "../../../../components/ui/AppLoader";

const DesignationDetail = () => {
  const { id: uid } = useParams();
  const { formatDate } = useFormatDate();
  const { data, isLoading, error } = useGetDesignationDetailQuery({ uid });

  const navigate = useNavigate();

  const designationDetail = data?.data;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/employee_avatar.png";
  };

  if (isLoading) {
    return <AppLoader />;
  }

  if (error) {
    return <Text color="red">Failed to load designation details.</Text>;
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
            <IconBriefcase size={24} className="text-blue-600" />
            <Text size="xl" fw={700} className="text-gray-800">
              {designationDetail?.name}
            </Text>
          </Group>
          <Badge
            color={designationDetail?.active ? "green" : "red"}
            variant="light"
            size="md"
            radius="sm"
          >
            {designationDetail?.active ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <Divider my="md" />

        {/* Designation Metadata */}
        <Stack gap="xs">
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Designation ID:
            </Text>
            <Text size="sm" className="font-mono">
              {designationDetail?.uid}
            </Text>
          </Group>

          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Company ID:
            </Text>
            <Text size="sm" className="font-mono">
              {designationDetail?.company_id}
            </Text>
          </Group>

          <Group gap="xs">
            <Text size="sm" c="dimmed">
              Created At:
            </Text>
            <Text size="sm">{formatDate(designationDetail?.create_at)}</Text>
          </Group>

          {designationDetail?.update_at && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Last Updated:
              </Text>
              <Text size="sm">{formatDate(designationDetail?.update_at)}</Text>
            </Group>
          )}
        </Stack>

        <Divider my="md" />

        {/* Activity Log */}
        {/* {designationDetail?.logs && (
          <Paper withBorder p="sm" radius="md" className="bg-gray-50">
            <Stack gap="xs">
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  Last Activity:
                </Text>
                <Text size="sm">{designationDetail.logs.message}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  By:
                </Text>
                <Text size="sm">{designationDetail.logs.admin}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  On:
                </Text>
                <Text size="sm">{formatDate(designationDetail.logs.create_at)}</Text>
              </Group>
            </Stack>
          </Paper>
        )} */}

        <Divider my="md" />

        {/* Employees Section */}
        <Text size="lg" fw={600} className="mb-4">
          Employees with this Designation
        </Text>

        <Stack gap="sm">
          {designationDetail?.employees.map((employee) => {
            return (
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
                    <img
                      src={getImageUrl(employee?.employee_id)}
                      alt="employee"
                      className="w-16 h-16 object-cover rounded-full border"
                      onError={handleImageError}
                    />
                    <Stack gap={2}>
                      <Text fw={600} className="text-gray-800">
                        {employee.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {employee.department}
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
            );
          })}
        </Stack>
      </Card>
    </>
  );
};

export default DesignationDetail;
