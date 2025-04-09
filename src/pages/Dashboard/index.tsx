import { useGetDashboardResponseQuery } from "../../features/api/companySlice";
import { Alert, Title, Card, Image, Divider, Skeleton } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { biaxialData } from "./DummyData";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../services/auth/useAuth";
import { Leave, Overtime } from "../../features/api/typesOld";
import { useAllLeaveQuery } from "../../features/api/leaveSlice";
import { lazy, Suspense } from "react";
import { IoCloudOffline } from "react-icons/io5";
import { MdNetworkCell } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { useGetAllOvertimeQuery } from "../../features/api/overtimeSlice";

const LeaveSection = lazy(() => import("./LeaveSection"));
const OvertimeSection = lazy(() => import("./OvertimeSection"));

const skeleton = (
  <div className="p-4">
    <Skeleton height={30} mb={6} radius="sm" c="grape" />
    <Skeleton height={30} width="100%" radius="sm" mb={6} />
    <Skeleton height={30} width="100%" radius="sm" mb={4} />
    <Skeleton height={30} width="100%" radius="md" />
  </div>
);

const Dashboard = () => {
  const {
    data: dashboardData,
    // isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetDashboardResponseQuery();
  const {
    data: leaves,
    isLoading: leavesLoading,
    error: leavesError,
    // refetch: leaveRefetch,
  } = useAllLeaveQuery({
    page: 1,
    limit: 10,
  });
  const {
    data: overtimeData,
    isLoading: overtimeLoading,
    error: overtimeError,
  } = useGetAllOvertimeQuery({
    page: 1,
    limit: 10,
  });

  const pendingLeaves = Array.isArray(leaves?.data)
    ? leaves.data.filter((item: Leave) => item.is_approved === "pending")
    : leaves?.data.is_approved === "pending"
    ? leaves?.data
    : null;

  const pendingOvertime = Array.isArray(overtimeData?.data)
    ? overtimeData.data.filter(
        (item: Overtime) => item.is_approved === "pending"
      )
    : overtimeData?.data.is_approved === "pending"
    ? overtimeData?.data
    : null;

  const { logout } = useAuth();
  // if (isLoading) {
  //   return <div className="flex justify-center items-center">loading...</div>;
  // }
  if (dashboardError) {
    if ((dashboardError as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching dashboard data:", dashboardError);
      <Alert color="red">Error loading dashboard data</Alert>;
    }
  }

  const { department } = dashboardData?.data || {};

  return (
    <div className="flex gap-4 my-6 lg:my-12 md:gap-6 lg:mx-8 mx-4 w-[95%] overflow-x-hidden">
      <div className="w-[65%]">
        <div className="flex flex-col justify-evenly mb-6 gap-8 rounded-md">
          <Card
            withBorder
            className=" shadow-lg 
           flex flex-col md:flex-row justify-center gap-2 rounded-md hover:shadow-md transition-shadow"
          >
            {/* Employee Info */}
            <div className="border border-green-200 flex flex-col items-center sm:justify-around gap-2 w-[270px] p-4">
              <div className="flex justify-between gap-4">
                <Image
                  src="/assets/team.png"
                  fit="contain"
                  className="min-w-10 w-8 h-8"
                  alt="Employee Icon"
                />
                <Title className="flex flex-row gap-2 items-center text-gray-500 text-lg">
                  {/* <span className="font-semibold text-[1rem]"> */}
                  Employees
                  {/* </span> */}
                </Title>
              </div>
              <Divider size="xs" w="100%" color="blue" />

              <div className="flex items-center justify-between gap-6">
                <div className="flex gap-4 items-center text-center">
                  <div className="flex gap-2 text-gray-500 items-center">
                    <IoIosPeople className="text-green-500" size={28} />
                    <p className="font-bold text-green-500">{60}</p>
                  </div>
                  <div className="flex gap-2 text-blue-500 items-center">
                    <MdNetworkCell size={20} />
                    <p className="font-bold text-green-400">
                      {/* {employee?.active_employee || 0} */}
                      55
                    </p>
                  </div>
                  {/* {employee?.inactive_employee !== 0 && (
                    <div className="flex gap-2 text-blue-300">
                      <Text c="dimmed">Inactive</Text>
                      <Text c="black" fw={700}>
                        {employee?.inactive_employee || 0}
                      </Text>
                    </div>
                  )} */}
                  <div className="flex gap-2 text-gray-400 items-center">
                    <IoCloudOffline size={24} />
                    <p className="font-bold">5</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Department Info */}
            <div className="border border-green-200 flex flex-col items-center sm:justify-around gap-2 w-[270px] p-4">
              <div className="flex justify-between gap-4">
                <Image
                  src="/assets/department.png"
                  fit="contain"
                  className="min-w-10 w-8 h-8"
                  alt="Employee Icon"
                />
                <Title className="flex flex-row gap-2 items-center text-lg text-gray-500">
                  {/* <span className="font-semibold text-[1rem]"> */}
                  Departments
                  {/* </span> */}
                </Title>
              </div>
              <Divider size="xs" w="100%" color="blue" />

              {/* Department Info */}

              <div className="flex items-center justify-between gap-6">
                <div className="flex gap-4 items-center text-center">
                  <div className="flex gap-2 text-gray-500 items-center">
                    <IoIosPeople className="text-green-500" size={28} />
                    <p className="font-bold text-green-500">
                      {department?.total || 0}
                    </p>
                  </div>
                  <div className="flex gap-2 text-blue-500 items-center">
                    <MdNetworkCell size={20} />
                    <p className="font-bold">{department?.active || 0}</p>
                  </div>
                  {department?.inactive !== 0 && (
                    <div className="flex gap-2 text-gray-400 items-center">
                      <IoCloudOffline size={24} />
                      <p className="font-bold">{department?.inactive || 0}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <>
          <Card
            shadow="sm"
            padding="lg"
            mb="lg"
            className="w-[full] rounded-md shadow-lg"
          >
            <p className="font-semibold text-center mb-7 text-blue-500 opacity-65">
              Company growth
            </p>

            <LineChart
              h={300}
              data={biaxialData}
              dataKey="name"
              withRightYAxis
              yAxisLabel="uv"
              rightYAxisLabel="pv"
              series={[
                { name: "uv", color: "pink.6" },
                { name: "pv", color: "cyan.6", yAxisId: "right" },
              ]}
            />
          </Card>
        </>
      </div>
      <div className="w-[35%]">
        <div className="mb-6 w-full bg-white">
          {leaves && Array.isArray(leaves?.data) && leaves?.data.length > 0 && (
            <Suspense fallback={skeleton}>
              <LeaveSection
                data={pendingLeaves ?? []}
                loading={leavesLoading}
                error={leavesError as FetchBaseQueryError}
              />
            </Suspense>
          )}
        </div>
        <div className="mb-6 w-full bg-white">
          {overtimeData &&
            Array.isArray(overtimeData?.data) &&
            overtimeData?.data.length > 0 && (
              <Suspense fallback={skeleton}>
                <OvertimeSection
                  data={pendingOvertime ?? []}
                  loading={overtimeLoading}
                  error={overtimeError as FetchBaseQueryError}
                />
              </Suspense>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
