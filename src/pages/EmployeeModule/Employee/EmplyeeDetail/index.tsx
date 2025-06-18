import { useNavigate, useParams } from "react-router-dom";
import { useGetEmployeeDetailQuery } from "../../../../features/api/employeeSlice";
import {
  Badge,
  Button,
  Flex,
  Grid,
  Loader,
  Paper,
  Tabs,
  Text,
} from "@mantine/core";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import {
  MdWork,
  MdPerson,
  MdEmergency,
  MdHistory,
  MdLockOpen,
} from "react-icons/md";
import { useState } from "react";
import { IconType } from "react-icons";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { getImageUrl } from "../../../../services/utils/getImageUrl";
import { IconCheck, IconX } from "@tabler/icons-react";
import InfoItem from "../../../../components/ui/InfoItem";

const EmployeeDetail = () => {
  const { uid } = useParams();
  const {
    data: employee,
    isLoading,
    error,
  } = useGetEmployeeDetailQuery({ uid });
  const [activeTab, setActiveTab] = useState<string | null>("personal");
  const { formatDate } = useFormatDate();
  const navigate = useNavigate();

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

  const { personal, work, emergency_contact, employee_access, logs } =
    employee.data;

  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon?: IconType;
    title: string;
  }) => (
    <Flex gap="sm" align="center" mb="xl" className="border-b pb-2">
      {Icon && <Icon size={20} className="text-blue-600" />}
      <Text fw={600} size="lg" className="text-gray-700">
        {title}
      </Text>
    </Flex>
  );

  // const InfoItem = ({
  //   label,
  //   value,
  // }: {
  //   label: string;
  //   value?: string | number;
  // }) => (
  //   <div className="mb-4">
  //     <Text size="sm" className="text-gray-500 mb-1">
  //       {label}
  //     </Text>
  //     <Text size="md" className="text-gray-800 font-medium">
  //       {value || "N/A"}
  //     </Text>
  //   </div>
  // );

  const ProfileCard = ({ children }: { children: React.ReactNode }) => (
    <Paper withBorder p="lg" className="bg-white rounded-lg shadow-sm">
      {children}
    </Paper>
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/employee_avatar.png";
  };

  const formatLabel = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()); // e.g. "leave_management" → "Leave Management"
  };

  return (
    <div className="px-8 w-full pb-6 mx-auto">
      {/* Profile Header */}
      <Flex
        justify="space-between"
        gap="xl"
        align="center"
        mb="lg"
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        {/* Left Section: Avatar + Info */}
        <Flex gap="xl" align="center">
          <img
            src={
              getImageUrl(work?.employee_id) || "/assets/employee_avatar.png"
            }
            onError={handleImageError}
            alt="Employee"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
            }}
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

        {/* Right Section: Edit Button */}
        <Button
          color="blue"
          onClick={() => navigate(`/employees/${uid}/edit-employee`)}
        >
          Edit
        </Button>
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
              <Tabs.Tab value="emergency" leftSection={<MdWork size={18} />}>
                Emergency
              </Tabs.Tab>
              <Tabs.Tab value="access" leftSection={<MdLockOpen size={18} />}>
                Accesses
              </Tabs.Tab>
            </Tabs.List>

            <ProfileCard>
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <SectionHeader icon={MdPerson} title="Personal Information" />
                  <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <div className="space-y-3">
                        <InfoItem
                          label="Phone"
                          value={`+88${personal.phone}`}
                          highlight
                        />
                        <InfoItem
                          label="Email"
                          value={personal.email}
                          link={`mailto:${personal.email}`}
                        />
                        <InfoItem
                          label="Date of Birth"
                          value={
                            personal.bod
                              ? formatDate(personal.bod)
                              : "Not specified"
                          }
                        />
                      </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <div className="space-y-3">
                        <InfoItem
                          label="Address"
                          value={personal.address || "No address provided"}
                          multiline
                        />
                        <InfoItem
                          label="Marital Status"
                          value={personal.marital_status || "Not specified"}
                        />
                        {personal.marital_status === "Married" && (
                          <InfoItem
                            label="Spouse Name"
                            value={personal.spouse_name}
                          />
                        )}
                      </div>
                    </Grid.Col>
                  </Grid>
                </div>
              )}

              {activeTab === "work" && (
                <div className="space-y-6">
                  <SectionHeader icon={MdWork} title="Work Information" />
                  <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <div className="space-y-3">
                        <InfoItem
                          label="Employee ID"
                          value={work.employee_id}
                          highlight
                        />
                        <InfoItem
                          label="Joining Date"
                          value={
                            work.joining_date
                              ? formatDate(work.joining_date)
                              : "N/A"
                          }
                        />
                        <InfoItem
                          label="Department"
                          value={work.department?.name || "N/A"}
                        />
                      </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <div className="space-y-3">
                        <InfoItem
                          label="Salary"
                          value={
                            work.salary
                              ? `$${work.salary.toLocaleString()}`
                              : "Confidential"
                          }
                          highlight
                        />
                        <InfoItem
                          label="Work Location"
                          value={work.work_location || "Not specified"}
                        />
                        <InfoItem
                          label="Work Email"
                          value={work.work_email}
                          link={`mailto:${work.work_email}`}
                        />
                      </div>
                    </Grid.Col>
                  </Grid>
                </div>
              )}

              {activeTab === "emergency" && (
                <div className="space-y-6">
                  <SectionHeader icon={MdEmergency} title="Emergency Contact" />
                  <div className="border-2 border-red-100 bg-red-50 rounded-lg p-4">
                    <Grid gutter="xl">
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <div className="space-y-3">
                          <InfoItem
                            label="Contact Name"
                            value={emergency_contact.name}
                            highlight
                          />
                          <InfoItem
                            label="Relationship"
                            value={emergency_contact.relationship}
                          />
                        </div>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <div className="space-y-3">
                          <InfoItem
                            label="Phone"
                            value={
                              emergency_contact.phone
                                ? `+88${emergency_contact.phone}`
                                : "Not provided"
                            }
                            link={
                              emergency_contact.phone
                                ? `tel:${emergency_contact.phone}`
                                : undefined
                            }
                            highlight
                          />
                          <InfoItem
                            label="Address"
                            value={
                              emergency_contact.address || "No address provided"
                            }
                            multiline
                          />
                        </div>
                      </Grid.Col>
                    </Grid>
                  </div>
                </div>
              )}

              {activeTab === "access" && (
                <>
                  <SectionHeader icon={MdLockOpen} title="Employee Access" />
                  <div className="w-full h-96 overflow-y-auto pr-4">
                    <Grid gutter="lg">
                      {Object.entries(employee_access).map(([key, value]) => {
                        const isAllowed = value === "a";
                        const isApproval = key.includes("_approve_");

                        return (
                          <Grid.Col
                            key={key}
                            span={{ base: 12, md: 6, lg: 4 }}
                            className="group"
                          >
                            <div
                              className={`p-4 rounded-lg border ${
                                isAllowed
                                  ? "border-green-100 bg-green-50 hover:bg-green-100"
                                  : "border-red-100 bg-red-50 hover:bg-red-100"
                              } transition-colors`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <Text
                                    size="sm"
                                    className="font-semibold text-gray-700"
                                  >
                                    {formatLabel(key)}
                                  </Text>
                                  {isApproval && (
                                    <Badge
                                      variant="light"
                                      color="blue"
                                      size="xs"
                                      className="mt-1"
                                    >
                                      Approval Permission
                                    </Badge>
                                  )}
                                </div>
                                <Badge
                                  leftSection={
                                    isAllowed ? (
                                      <IconCheck size={14} className="mr-1" />
                                    ) : (
                                      <IconX size={14} className="mr-1" />
                                    )
                                  }
                                  color={isAllowed ? "green" : "red"}
                                  variant="filled"
                                  radius="sm"
                                >
                                  {isAllowed ? "Allowed" : "Unauthorized"}
                                </Badge>
                              </div>
                            </div>
                          </Grid.Col>
                        );
                      })}
                    </Grid>
                  </div>
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
              <div className="space-y-4 max-h-96 overflow-y-auto">
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
