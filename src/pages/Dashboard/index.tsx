import { useGetDashboardResponseQuery } from "../../features/api/companySlice";
import {
  Alert,
  Title,
  Card,
  Box,
  Image,
  Divider,
  Loader,
  Text,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { biaxialData } from "./DummyData";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuth } from "../../services/auth/useAuth";
import { lazy, Suspense } from "react";
import { Leave } from "../../features/api/types";
import { useAllLeaveQuery } from "../../features/api/leaveSlice";
import LeaveSection from "./LeaveSection";

const UpCounter = lazy(() => import("./UpCounter"));

const Dashboard = () => {
  const { data, isLoading, error } = useGetDashboardResponseQuery();
  const {
    data: leaves,
    // isLoading: leavesLoading,
    // error: leavesError,
    // refetch,
  } = useAllLeaveQuery({
    page: 1,
    limit: 10,
  });

  const pendingLeaves = Array.isArray(leaves?.data)
    ? leaves.data.filter((item: Leave) => item.is_approved === "pending")
    : leaves?.data.is_approved === "pending"
    ? leaves?.data
    : null;


  const { logout } = useAuth();
  if (isLoading) {
    return <div className="flex justify-center items-center">loading...</div>;
  }
  if (error) {
    if ((error as FetchBaseQueryError).status === 401) {
      console.error("Unauthorized access - logging out");
      logout();
    } else {
      console.error("Error fetching dashboard data:", error);
      <Alert color="red">Error loading dashboard data</Alert>;
    }
  }

  const { employee, leave, designation, department } = data?.data || {};

  console.log(employee, leave, designation, department);

  return (
    <div className="flex gap-4 my-10 md:gap-6">
      <Box className="w-5/12 border-r-2 px-6">
        <Box className="flex flex-col justify-evenly py-8 gap-8">
          <Card
            withBorder
            className=" bg-gray-200
           flex flex-col md:flex-row justify-center gap-2 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Employee Info */}
            <Box
              p="sm"
              className="border border-blue-300 rounded-lg flex flex-col items-center sm:justify-around gap-2 w-[260px]"
            >
              <Box className="flex justify-between gap-4">
                <Image
                  src="/assets/team.png"
                  fit="contain"
                  className="min-w-10 w-8 h-8"
                  alt="Employee Icon"
                />
                <Title className="flex flex-row gap-2 items-center text-gray-500 text-lg">
                  {/* <span className="font-semibold text-[1rem]"> */}
                  Employee
                  {/* </span> */}
                </Title>
              </Box>
              <Divider size="xs" w="100%" color="blue" />

              <Box className="flex items-center justify-between gap-6">
                <Box className="flex gap-4 items-center text-center">
                  <Suspense fallback={<Loader size="md" type="bars" />}>
                    <Text c="dimmed">Total</Text>
                    <UpCounter
                      upperRange={employee?.total_employee || 0}
                      style={{ color: "black", size: "lg" }}
                    />
                  </Suspense>
                  <Suspense fallback={<Loader size="md" type="bars" />}>
                    <Text c="dimmed">Active</Text>
                    <UpCounter
                      upperRange={employee?.active_employee || 0}
                      style={{ color: "green", size: "md" }}
                    />
                  </Suspense>
                  {employee?.inactive_employee !== 0 && (
                    <Suspense fallback={<Loader size="md" type="bars" />}>
                      <Text c="dimmed">Inactive</Text>
                      <UpCounter
                        upperRange={employee?.inactive_employee || 0}
                        style={{ color: "red", size: "md" }}
                      />
                    </Suspense>
                  )}
                </Box>
              </Box>
            </Box>
            {/* Department Info */}
            <Box
              p="sm"
              className="border border-blue-300 rounded-lg flex flex-col items-center sm:justify-around gap-2 w-[260px]"
            >
              <Box className="flex justify-between gap-4">
                <Image
                  src="/assets/department.png"
                  fit="contain"
                  className="min-w-10 w-8 h-8"
                  alt="Employee Icon"
                />
                <Title className="flex flex-row gap-2 items-center text-gray-500 text-lg">
                  {/* <span className="font-semibold text-[1rem]"> */}
                  Department
                  {/* </span> */}
                </Title>
              </Box>
              <Divider size="xs" w="100%" color="blue" />

              {/* Department Info */}

              <Box className="flex items-center justify-between gap-6">
                <Box className="flex gap-4 items-center text-center">
                  <Suspense fallback={<Loader size="md" type="bars" />}>
                    <Text c="dimmed">Total</Text>
                    <UpCounter
                      upperRange={department?.total || 0}
                      style={{ color: "black", size: "lg" }}
                    />
                  </Suspense>
                  <Suspense fallback={<Loader size="md" type="bars" />}>
                    <Text c="dimmed">Active</Text>
                    <UpCounter
                      upperRange={department?.active || 0}
                      style={{ color: "green", size: "md" }}
                    />
                  </Suspense>
                  {department?.inactive !== 0 && (
                    <Suspense fallback={<Loader size="md" type="bars" />}>
                      <Text c="dimmed">Inactive</Text>
                      <UpCounter
                        upperRange={department?.inactive || 0}
                        style={{ color: "red", size: "md" }}
                      />
                    </Suspense>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>

        <Box>
          <Card
            shadow="sm"
            padding="lg"
            mb="lg"
            className="w-[full] bg-gray-200"
          >
            <Title order={4} ta="center" mb={20} c="blue">
              Company growth
            </Title>
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
        </Box>
      </Box>
      <Box>
        <Box className="border">
          <Text c="orange" fw={700} size="lg">
            Leaves
          </Text>
          {leaves && Array.isArray(leaves?.data) && leaves?.data.length > 0 ? (
            <LeaveSection data={leaves?.data ?? []} />
          ) : (
            <Text ta="center">No data found</Text>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
