import { useParams } from "react-router-dom";
import { useGetEmployeeDetailQuery } from "../../../../features/api/employeeSlice";
import { Badge, Avatar, Stepper, Group, Loader, Tabs } from "@mantine/core";
import ErrorAlert from "../../../../components/shared/ErrorAlert";
import { MdOutlineWorkOutline } from "react-icons/md";
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
  const [activeTab, setActiveTab] = useState<string | null>("personal");

  const logsSteps = (
    Array.isArray(employee?.data?.logs) ? employee.data.logs : []
  )
    .filter(Boolean)
    .map((log, index) => (
      <Stepper.Step
        key={index}
        label={<p className="text-sm">{log?.admin ?? "N/A"}</p>}
        description={<p className="text-xs">{log?.message ?? "N/A"}</p>}
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
    <div className="p-6 bg-gray-50 min-h-[70vh]">
      <>
        <Group align="flex-start">
          <Avatar
            size={120}
            radius="xl"
            src={`https://avatar.iran.liara.run/public`}
          />
          <div className="self-center">
            <p className="text-lg text-gray-500">
              {employee?.data.personal.name}
            </p>
            <p className="text-sm text-gray-500">
              {employee?.data.work.designation.name} -{" "}
              {employee?.data.work.department.name}
            </p>
            <Badge
              color={employee?.data.personal.active ? "green" : "red"}
              variant="light"
            >
              {employee?.data.personal.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Group>
      </>
      <div className="flex justify-between mt-4">
        <Tabs
          color="blue"
          variant="outline"
          defaultValue="personal"
          value={activeTab}
          onChange={setActiveTab}
          className="lg:w-[60%] xl:w-[50%]"
        >
          <Tabs.List className={`w-fit rounded-lg my-6`}>
            <Tabs.Tab value="personal">
              <BsFillPersonVcardFill color="#56203D" size={20} />
            </Tabs.Tab>
            <Tabs.Tab value="work">
              <MdOutlineWorkOutline color="#56203D" size={20} />
            </Tabs.Tab>
            <Tabs.Tab value="others">
              <RiArchive2Line color="#56203D" size={20} />
            </Tabs.Tab>
          </Tabs.List>
          <div className="px-4 border pb-6 bg-[#808FB8] h-[320px]">
            <Tabs.Panel value="personal" px={8}>
              <p className="text-lg text-center text-white border-b-2 border-amber-300 py-2 mb-6 font-thin">
                Personal Information
              </p>
              <>
                <>
                  <p className="text-md text-white text-white flex justify-between">
                    <span className="text-gray-200">Phone:</span>
                    +88{employee?.data.personal.phone}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Email:</span>
                    {employee?.data.personal.email}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Date of birth:</span>
                    {employee?.data.personal.bod
                      ? new Date(
                          employee.data.personal.bod
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Marital Status:</span>
                    {employee?.data.personal.marital_status}
                  </p>
                </>
                <>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Address:</span>
                    {employee?.data.personal.address}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Spouse Name:</span>
                    {employee?.data.personal.spouse_name || "N/A"}
                  </p>
                </>
              </>
            </Tabs.Panel>

            <Tabs.Panel value="work" px={8}>
              <p className="text-lg text-center text-white border-b-2 border-amber-300 py-2 mb-6 font-thin">
                Work Information
              </p>
              <>
                <>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Employee ID:</span>
                    {employee?.data.work.employee_id}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Company:</span>
                    {employee?.data.work.company?.name}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Joining Date:</span>
                    {employee?.data.work.joining_date
                      ? new Date(
                          employee.data.work.joining_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Salary:</span>$
                    {employee?.data.work.salary?.toFixed(2) ?? "N/A"}
                  </p>
                </>
                <>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Work Location:</span>
                    {employee?.data.work.work_location}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Work Email:</span>
                    {employee?.data.work.work_email}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Shift & Schedule:</span>
                    {employee?.data.work.shift_and_schedule.name}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Is Supervisor:</span>
                    {employee?.data.work.supervisor ? "Yes" : "No"}
                  </p>
                </>
              </>
            </Tabs.Panel>
            <Tabs.Panel value="others">
              <p className="text-lg text-center text-white border-b-2 border-amber-300 py-2 mb-6 font-thin">
                Emergency Contact
              </p>
              <>
                <>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Contact Name:</span>
                    {employee?.data.emergency_contact.name}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Contact Relationship:</span>
                    {employee?.data.emergency_contact.relationship}
                  </p>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Contact Phone:</span>
                    {employee?.data.emergency_contact.phone}
                  </p>
                </>
                <>
                  <p className="text-md text-white flex justify-between">
                    <span className="text-gray-200">Contact Address:</span>
                    {employee?.data.emergency_contact.address}
                  </p>
                </>
              </>
            </Tabs.Panel>
          </div>
        </Tabs>
        <div className="p-6 bg-blue-50 border">
          <p className="text-center text-blue-600 text-lg font-semibold mb-4">
            Activity Logs
          </p>
          {logsSteps.length ? (
            <Stepper
              color="blue"
              orientation="vertical"
              size="xs"
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
            <p className="text-center text-gray-500 text-sm">
              No activity logs available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
