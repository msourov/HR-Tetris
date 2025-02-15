import { useParams } from "react-router-dom";
import { useGetEmployeeDetailQuery } from "../../../../features/api/employeeSlice";
import {
  Avatar,
  Badge,
  Flex,
  Grid,
  Loader,
  Paper,
  Tabs,
  Text,
} from "@mantine/core";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { MdWork, MdPerson, MdEmergency, MdHistory } from "react-icons/md";
import { useState } from "react";
import { IconType } from "react-icons";
import useFormatDate from "../../../../services/utils/useFormatDate";

const EmployeeDetail = () => {
  const { uid } = useParams();
  const {
    data: employee,
    isLoading,
    error,
  } = useGetEmployeeDetailQuery({ uid });
  const [activeTab, setActiveTab] = useState<string | null>("personal");
  const { formatDate } = useFormatDate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader variant="dots" />
      </div>
    );
  }

  if (error || !employee) {
    return <ErrorAlert message="Error fetching employee details" />;
  }

  const { personal, work, emergency_contact, logs } = employee.data;

  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon: IconType;
    title: string;
  }) => (
    <Flex gap="sm" align="center" mb="xl" className="border-b pb-2">
      <Icon size={20} className="text-blue-600" />
      <Text fw={600} size="lg" className="text-gray-700">
        {title}
      </Text>
    </Flex>
  );

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number;
  }) => (
    <div className="mb-4">
      <Text size="sm" className="text-gray-500 mb-1">
        {label}
      </Text>
      <Text size="md" className="text-gray-800 font-medium">
        {value || "N/A"}
      </Text>
    </div>
  );

  const ProfileCard = ({ children }: { children: React.ReactNode }) => (
    <Paper withBorder p="lg" className="bg-gray-50 rounded-lg">
      {children}
    </Paper>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <Flex
        gap="xl"
        align="center"
        mb="xl"
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <Avatar
          size={120}
          radius="100%"
          src={`https://avatar.iran.liara.run/public`}
        />
        <div>
          <Text fw={700} size="xl" className="text-gray-800 mb-1">
            {personal.name}
          </Text>
          <Text size="md" className="text-gray-600 mb-2">
            {work.designation.name} • {work.department.name}
          </Text>
          <Badge
            variant="light"
            color={personal.active ? "green" : "red"}
            size="lg"
            radius="sm"
          >
            {personal.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </Flex>

      <Grid gutter="xl">
        {/* Main Content */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            color="blue"
          >
            <Tabs.List mb="xl">
              <Tabs.Tab value="personal" leftSection={<MdPerson size={18} />}>
                Personal
              </Tabs.Tab>
              <Tabs.Tab value="work" leftSection={<MdWork size={18} />}>
                Work
              </Tabs.Tab>
              <Tabs.Tab
                value="emergency"
                leftSection={<MdEmergency size={18} />}
              >
                Emergency
              </Tabs.Tab>
            </Tabs.List>

            <ProfileCard>
              {activeTab === "personal" && (
                <>
                  <SectionHeader icon={MdPerson} title="Personal Information" />
                  <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InfoItem label="Phone" value={`+88${personal.phone}`} />
                      <InfoItem label="Email" value={personal.email} />
                      <InfoItem
                        label="Date of Birth"
                        value={
                          personal.bod ? formatDate(personal.bod) : undefined
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InfoItem label="Address" value={personal.address} />
                      <InfoItem
                        label="Marital Status"
                        value={personal.marital_status}
                      />
                      <InfoItem
                        label="Spouse Name"
                        value={personal.spouse_name}
                      />
                    </Grid.Col>
                  </Grid>
                </>
              )}

              {activeTab === "work" && (
                <>
                  <SectionHeader icon={MdWork} title="Work Information" />
                  <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InfoItem label="Employee ID" value={work.employee_id} />
                      <InfoItem label="Company" value={work.company?.name} />
                      <InfoItem
                        label="Joining Date"
                        value={
                          work.joining_date
                            ? formatDate(work.joining_date)
                            : undefined
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InfoItem
                        label="Salary"
                        value={
                          work.salary ? `$${work.salary.toFixed(2)}` : undefined
                        }
                      />
                      <InfoItem
                        label="Work Location"
                        value={work.work_location}
                      />
                      <InfoItem label="Work Email" value={work.work_email} />
                    </Grid.Col>
                  </Grid>
                </>
              )}

              {activeTab === "emergency" && (
                <>
                  <SectionHeader icon={MdEmergency} title="Emergency Contact" />
                  <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InfoItem label="Name" value={emergency_contact.name} />
                      <InfoItem
                        label="Relationship"
                        value={emergency_contact.relationship}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <InfoItem label="Phone" value={emergency_contact.phone} />
                      <InfoItem
                        label="Address"
                        value={emergency_contact.address}
                      />
                    </Grid.Col>
                  </Grid>
                </>
              )}
            </ProfileCard>
          </Tabs>
        </Grid.Col>

        {/* Activity Log */}
        <Grid.Col span={{ base: 12, md: 4 }} className="self-end">
          <ProfileCard>
            <SectionHeader icon={MdHistory} title="Activity Log" />
            {Array.isArray(logs) && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <Text size="sm" className="text-gray-800 font-medium">
                      {log.admin || "System"}
                    </Text>
                    <Text size="sm" className="text-gray-600">
                      {log.message}
                    </Text>
                    {log.create_at && (
                      <Text size="xs" className="text-gray-400 mt-1">
                        {formatDate(log.create_at, true)}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Text size="sm" className="text-gray-400 text-center py-6">
                No activity records found
              </Text>
            )}
          </ProfileCard>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default EmployeeDetail;
