import { useGetDashboardResponseQuery } from "../../features/api/companySlice";
import { Card, Divider, Skeleton, Text, Badge } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { biaxialData } from "./DummyData";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { lazy, Suspense } from "react";
import { IoIosPeople } from "react-icons/io";
import {
  IconCalendarEvent,
  IconCalendarStats,
  IconClock,
  IconClockFilled,
} from "@tabler/icons-react";
import {
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useGetAllAnnouncementsQuery } from "../../features/api/announcementSlice";

const LeaveSection = lazy(() => import("./LeaveSection"));
const OvertimeSection = lazy(() => import("./OvertimeSection"));
const NoticeSection = lazy(() => import("./NoticeSection"));

const upcomingEvents = [
  {
    title: "Team Building Retreat",
    date: "June 28, 2025",
    time: "10:00 AM",
    type: "Company Event",
  },
  {
    title: "Independence Day",
    date: "July 4, 2025",
    time: "-",
    type: "Holiday",
  },
  {
    title: "Monthly Townhall",
    date: "July 12, 2025",
    time: "4:00 PM",
    type: "Meeting",
  },
  {
    title: "Monthly Townhall",
    date: "July 12, 2025",
    time: "4:00 PM",
    type: "Meeting",
  },
  {
    title: "Monthly Townhall",
    date: "July 12, 2025",
    time: "4:00 PM",
    type: "Meeting",
  },
  {
    title: "Monthly Townhall",
    date: "July 12, 2025",
    time: "4:00 PM",
    type: "Meeting",
  },
];

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
    data: announcementData,
    isLoading: announcementLoading,
    error: announcementError,
  } = useGetAllAnnouncementsQuery({
    page: 1,
    limit: 10,
  });

  const pendingAnnouncement = Array.isArray(announcementData?.data)
    ? announcementData.data.filter((item) => item.is_approved === "pending")
    : [];

  const attendanceData = [
    { name: "Present", value: 18, color: "#16a34a" }, // green
    { name: "Absent", value: 3, color: "#ef4444" }, // red
    { name: "On Leave", value: 2, color: "#eab308" }, // yellow
  ];
  const ATT_COLORS = ["#22c55e", "#ef4444", "#eab308"];
  const EMP_COLORS = ["#2563eb", "#d946ef"];

  const employeeData = [
    { name: "Active", value: 55, color: "#3b82f6" }, // blue
    { name: "Inactive", value: 5, color: "#6b7280" }, // gray
  ];

  // if (isLoading) {
  //   return <div className="flex justify-center items-center">loading...</div>;
  // }
  console.log(dashboardError, "dashboardError");
  console.log(dashboardData, "dashboardData");

  return (
    <div className="flex gap-6 my-4 lg:my-8 md:gap-6 lg:mx-8 mx-4 w-[95%] overflow-x-hidden">
      <div className="w-[70%]">
        <div className="flex flex-col xl:flex-row justify-evenly mb-6 gap-4 rounded-md">
          <Card
            withBorder
            className="flex-1 min-w-[360px] w-full h-fit 
            justify-center gap-1 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-1">
              <IconCalendarStats size={20} className="text-purple-600" />
              <Text className="text-purple-600 font-semibold text-sm">
                Today's Stats
              </Text>
            </div>
            <Divider mb="sm" />

            <div className="flex flex-col gap-4 w-full items-center">
              {/* Attendance Info */}
              <div className=" w-full shadow-md bg-white hover:shadow-md transition-all duration-300 flex flex-col items-center gap-2 px-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <IconClockFilled color="#2563eb" size={18} />
                  <Text className="text-gray-700 text-sm font-thin">
                    Attendance
                  </Text>
                </div>

                <Divider size="xs" w="100%" color="blue" />

                {/* Dummy Attendance Stats */}
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name }) => name} // label outside the pie
                      labelLine={true}
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={ATT_COLORS[index % ATT_COLORS.length]}
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="inside"
                        fill="#fff"
                        fontSize={12}
                        fontWeight={600}
                      />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Employees Info */}
              <div className=" w-full shadow-md bg-white hover:shadow-md transition-all duration-300 flex flex-col items-center gap-2 px-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <IoIosPeople color="#2563eb" size={18} />
                  <Text className="text-gray-700 text-SM font-thin">
                    Employee
                  </Text>
                </div>

                <Divider size="xs" w="100%" color="blue" />

                {/* Employee Stats */}
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={employeeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      // fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={true}
                    >
                      {employeeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EMP_COLORS[index % EMP_COLORS.length]}
                        />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="inside"
                        fill="#fff"
                        fontSize={12}
                        fontWeight={600}
                      />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          <Card
            withBorder
            className="w-full pr-2 gap-1 lg:w-full xl:w-[440px] max-h-[480px] bg-white hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-1">
              <IconCalendarEvent size={20} className="text-purple-600" />
              <Text className="text-md font-semibold text-purple-600">
                Upcoming Events
              </Text>
            </div>
            <Divider mb="xs" />

            <div className="flex flex-col gap-3 overflow-y-auto scrollbar-custom py-2">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col border-l-4 pl-3 border-blue-200"
                >
                  <Text className="font-medium text-gray-800">
                    {event.title}
                  </Text>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{event.date}</span>
                    {event.time !== "-" && (
                      <span className="flex items-center gap-1">
                        <IconClock size={14} />
                        {event.time}
                      </span>
                    )}
                  </div>
                  <Badge
                    color={event.type === "Holiday" ? "red" : "blue"}
                    size="xs"
                    className="w-fit mt-1"
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
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
      <div className="w-[30%]">
        <div className="mb-6 w-full bg-white">
          {/* {leaves && Array.isArray(leaves?.data) && leaves?.data.length > 0 && ( */}
          <Suspense fallback={skeleton}>
            <LeaveSection />
          </Suspense>
          {/* )} */}
        </div>
        <div className="mb-6 w-full bg-white">
          <Suspense fallback={skeleton}>
            <OvertimeSection />
          </Suspense>
        </div>
        <div className="mb-6 w-full bg-white">
          <Suspense fallback={skeleton}>
            <NoticeSection
              data={pendingAnnouncement ?? []}
              loading={announcementLoading}
              error={announcementError as FetchBaseQueryError}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
